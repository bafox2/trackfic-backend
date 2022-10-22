import * as UserService from '../service/user.service'
import * as SessionService from '../service/session.service'
import { createUserSessionHandler } from '../controller/session.controller'

import createServer from '../utils/server'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import log from '../utils/logger'

const app = createServer()

//session
//normal error usecase
//refresher

const userInputPayload = {
  name: 'Jane Doe',
  email: 'jane@gmail.com',
  password: '123456',
  passwordConfirmation: '123456',
}

const user = {
  email: 'jane@gmail.com',
  password: '123456',
}

const userWrong = {
  email: 'jane@gmail.com',
  password: '1234567',
}

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
})
