import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { createTrip } from '../service/trip.service'
import log from '../utils/logger'
import { omit } from 'lodash'

const app = createServer()

export const tripPayload = {
  user: '5f9f1c5b9c9b9c0b5c0b5c0b',
  title: 'Commute to work',
  description: 'My daily commute to work',
  origin: 'Home',
  destination: 'Work',
  schedule: '0 7 * * 1-5',
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
  })
  describe('given the route exists', () => {
    it('should return 200 and the product', async () => {
      const trip = await createTrip(tripPayload)
      const tripData = omit(trip, ['updatedAt', 'createdAt'])
      log.info('trip', { trip })
      const { body, status } = await supertest(app).get(`/api/trips/${trip._id}`)
      expect(status).toEqual(200)
      expect(body).toEqual(tripData)
      //createdAt and updatedAt are not equal
    })
  })
})
