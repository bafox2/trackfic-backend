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
  email: 'jane.doe@example.com',
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
        log.info('trip', { trip })
        const { body, status } = await supertest(app).get(`/api/trips/${trip._id}`)
        expect(status).toEqual(200)
        expect(body).toEqual(tripDataMongoose)
        //createdAt and updatedAt are not equal
      })
    })
  })

  describe('create trip route', () => {
    // describe('given the user is not logged in', () => {
    //   it('should return a 403', async () => {
    //     const { status } = await supertest(app).post(`/api/trips`).send(tripPayload)
    //     expect(status).toEqual(403)
    //   })
    // })

    describe('given the user is logged in', () => {
      it('should return a 200 and the trip', async () => {
        const jwt = signJwt(userPayload)
        const { body, status } = await supertest(app)
          .post(`/api/trips`)
          .set('Authorization', `Bearer ${jwt}`)
          .send(tripPayload)
        expect(status).toEqual(200)
        expect(body).toEqual({
          ...tripPayload,
          __v: 0,
          _id: body._id,
          createdAt: body.createdAt,
          updatedAt: body.updatedAt,
        })
      })
    })
  })

  describe('update trip route', () => {})

  describe('delete trip route', () => {})
})
