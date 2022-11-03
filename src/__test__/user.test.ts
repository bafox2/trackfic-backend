import * as UserService from '../service/user.service'
import mongoose from 'mongoose'
import createServer from '../utils/server'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import {
  userInputPayload,
  user,
  userPayload,
  userInputPayloadWrongConfirm,
  userInputPayloadWrongBody,
  userInputPayload2,
} from './testValues.spec'

const app = createServer()
const userId = new mongoose.Types.ObjectId().toString()

describe('user model', () => {
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  //registration
  describe('user registration', () => {
    describe('name is already taken', () => {
      it('should return 400', async () => {
        await supertest(app).post('/api/users').send(userInputPayload)
        const { body, status } = await supertest(app).post('/api/users').send(userInputPayload)
        expect(status).toEqual(400)
        expect(body).toHaveProperty('errors')
      })
      describe('given a valid username and password', () => {
        it('should return a user', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'createUser')
            // @ts-ignore
            .mockReturnValueOnce(userPayload)

          const { body, statusCode } = await supertest(app).post('/api/users').send(userInputPayload)
          expect(statusCode).toEqual(201)
          expect(body).toEqual(userPayload)
          expect(createUserServiceMock).toHaveBeenCalledWith(userInputPayload)
        })
      })
      describe('passwords do not match', () => {
        it('should return an error', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'createUser')
            // @ts-ignore
            .mockReturnValueOnce(userPayload)

          const { body, statusCode } = await supertest(app).post('/api/users').send(userInputPayloadWrongConfirm)
          expect(statusCode).toEqual(500)
          expect(createUserServiceMock).not.toHaveBeenCalledWith(userInputPayload)
        })
      })
      describe('given a curveball', () => {
        it('should return an error', async () => {
          const createUserServiceMock = jest
            .spyOn(UserService, 'createUser')
            // @ts-ignore
            .mockReturnValueOnce(userPayload)

          const { body, statusCode } = await supertest(app).post('/api/users').send(userInputPayloadWrongBody)
          expect(statusCode).toEqual(500)
          expect(createUserServiceMock).not.toHaveBeenCalledWith(userInputPayload)
        })
      })
    })
  })
  describe('/me api route', () => {
    describe('given a valid token', () => {
      it('should return a user', async () => {
        await supertest(app).post('/api/users').send(userInputPayload)
        const session = await supertest(app).post('/api/sessions').send(user)
        expect(session.body).toHaveProperty('accessToken')
        const { body, statusCode } = await supertest(app)
          .get('/api/me')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
        expect(statusCode).toEqual(200)
      })
    })
  })

  describe('tripNode virtual', () => {
    it('works from the service', async () => {
      const user = await UserService.createUser(userInputPayload2)
      // expect(user.trips).toBe([])
    })
  })
})
