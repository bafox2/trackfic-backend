import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { createTrip } from '../service/trip.service'
import log from '../utils/logger'
import { omit } from 'lodash'
import { signJwt } from '../utils/jwt.utils'

const app = createServer()
const userId = new mongoose.Types.ObjectId().toString()
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
export const tripPayload = {
  user: userId,
  title: 'Commute to work',
  description: 'My daily commute to work',
  origin: 'Home',
  destination: 'Work',
  schedule: '0 7 * * 1-5',
}
export const tripDataMongoose = {
  __v: 0,
  _id: expect.any(String),
  title: 'Commute to work',
  description: 'My daily commute to work',
  destination: 'Work',
  origin: 'Home',
  schedule: '0 7 * * 1-5',
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  user: expect.any(String),
}
export const userPayload = {
  _id: userId,
  email: 'jane@gmail.com',
  name: 'Jane Doe',
}

describe('trip', () => {
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('get trip route', () => {
    describe('given no route exists', () => {
      it('should return 404', async () => {
        const tripId = '123'
        await supertest(app).get(`/api/trips/${tripId}`).expect(404)
      })
    })
    describe('given the route exists', () => {
      it('should return 200 and the product', async () => {
        const trip = await createTrip(tripPayload)
        const tripData = omit(trip, ['updatedAt', 'createdAt'])
        const { body, status } = await supertest(app).get(`/api/trips/${trip._id}`)
        expect(status).toEqual(200)
        expect(body).toEqual(tripDataMongoose)
      })
    })
  })

  describe('create trip route', () => {
    describe('given the user is not logged in', () => {
      it('should return a 401', async () => {
        const obj = await supertest(app).post(`/api/trips`)
        expect(obj.status).toEqual(401)
      })
    })

    describe('given the user is logged in', () => {
      it('should return a 200 and the trip', async () => {
        //the test isn't working because jwt.utils signJwt function
        await supertest(app).post('/api/users').send(userInputPayload)
        const session = await supertest(app).post('/api/sessions').send(user)
        expect(session.body).toHaveProperty('accessToken')
        const { body, status } = await supertest(app)
          .post('/api/trips')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
          .send(tripPayload)
        expect(status).toEqual(200)
        expect(body).toEqual(tripDataMongoose)
      })
    })
  })

  describe('update trip route', () => {})

  describe('delete trip route', () => {})
})
