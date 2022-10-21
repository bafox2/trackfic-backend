import * as UserService from '../service/user.service'
import mongoose from 'mongoose'
import createServer from '../utils/server'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'

const app = createServer()
const userId = new mongoose.Types.ObjectId().toString()

const userPayload = {
  _id: userId,
  email: 'janedoe@janedoe.com',
  name: 'Jane Doe',
}
const userInputPayload = {
  name: 'Jane Doe',
  email: 'hanedoe@gmail.com',
  password: '123456',
  passwordConfirmation: '123456',
}
const userInputPayload2 = {
  name: 'Jane Doe',
  email: 'hanedoe@gmail.com',
  password: '123456',
  passwordConfirmation: '123456',
}
const userInputPayloadWrongConfirm = {
  name: 'Jane Doe',
  email: 'hanedoe@gmail.com',
  password: '123456',
  passwordConfirmation: '123457',
}
const userInputPayloadWrongBody = {
  name: 'Jane Doe',
  email: 'hanedoe@gmail.com',
  password: '123456',
  passwordConfirmation: '123457',
  wrong: 'wrong',
}

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
        const { body, status } = await supertest(app).post('/api/users').send(userInputPayload2)
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

    //   //session
    //   //normal usecase
    //   //refreshes
    // })
  })
})
