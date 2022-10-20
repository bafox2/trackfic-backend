import * as UserService from '../service/user.service'
import mongoose from 'mongoose'
import createServer from '../utils/server'
import supertest from 'supertest'
import validate from '../middleware/validate'

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
const userInputPayloadWrong = {
  name: 'Jane Doe',
  email: 'hanedoe@gmail.com',
  password: '123456',
  passwordConfirmation: '123457',
}

describe('user model', () => {
  //registration
  describe('user registration', () => {
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

        const { body, statusCode } = await supertest(app).post('/api/users').send(userInputPayloadWrong)
        expect(statusCode).toEqual(500)
        expect(createUserServiceMock).not.toHaveBeenCalledWith(userInputPayload)
      })
    })
  })
  // describe('name is already taken', () => {
  //   it('should return an error', async () => {
  //     await UserService.createUser(userInputPayload)
  //     await expect(UserService.createUser(userInputPayload)).rejects.toThrow()
  //   })
  describe('given a curveball', () => {
    it('should return an error', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockReturnValueOnce(userPayload)

      const { body, statusCode } = await supertest(app).post('/api/users').send(userInputPayloadWrong)
      expect(statusCode).toEqual(500)
      expect(createUserServiceMock).not.toHaveBeenCalledWith(userInputPayload)
    })
  })
  //   //validates
  //   //matching pws
  //   //error handlers

  //   //session
  //   //normal usecase
  //   //refreshes
  // })
})

// describe('create user session', () => {
//   describe('given a valid username and password', () => {
//     it('should return a user', async () => {})
//   })
//   describe('given an invalid login', () => {
//     it('should return an error', async () => {})
//   })
// }
