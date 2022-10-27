import * as UserService from '../service/user.service'
import * as SessionService from '../service/session.service'
import { createUserSessionHandler } from '../controller/session.controller'

import createServer from '../utils/server'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import log from '../utils/logger'
import { userInputPayload, user, userWrong } from './testValues.spec'

const app = createServer()

describe('session', () => {
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('given a valid email and password', () => {
    it('should return accessToken and refreshToken', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const res = await supertest(app).post('/api/sessions').send(user)

      expect(res.body).toHaveProperty('accessToken')
      expect(res.status).toEqual(200)
    })
  })

  describe('given an invalid email and password', () => {
    it('should return accessToken and refreshToken', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const res = await supertest(app).post('/api/sessions').send(userWrong)
      expect(res.body).not.toHaveProperty('accessToken')
      expect(res.body).toHaveProperty('errors')
    })
  })

  describe('delete', () => {
    it('should remove credentials', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const session = await supertest(app).post('/api/sessions').send(user)
      expect(session.body).toHaveProperty('accessToken')
      const res = await supertest(app)
        .delete('/api/sessions')
        .set('Authorization', `Bearer ${session.body.accessToken}`)
      expect(res.body).not.toHaveProperty('accesToken')
    })
  })

  describe('refreshes correctly', () => {
    it('should refresh', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const session = await supertest(app).post('/api/sessions').send(user)
      expect(session.body).toHaveProperty('refreshToken')
      //need to have the token expire, check if it refreshes
      const res = await supertest(app)
        .post('/api/sessions/')
        .set('Authorization', `Bearer ${session.body.refreshToken}`)
        .send(user)
      expect(res.body).toHaveProperty('accessToken')
    })
  })
})
