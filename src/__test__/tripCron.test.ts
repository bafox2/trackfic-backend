import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import TripNodeModel, { ITripNode } from '../models/tripNode.model'
import { createTrip } from '../service/trip.service'
import log from '../utils/logger'
import { omit } from 'lodash'
import { userInputPayload, user, tripPayload } from './testValues.spec'

const app = createServer()

describe('mongoose statics and methods for cron', () => {
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })
  describe('given everything valid', () => {
    // it('should return a 200 and the trip', async () => {
    //   await supertest(app).post('/api/users').send(userInputPayload)
    //   const session = await supertest(app).post('/api/sessions').send(user)
    //   expect(session.body).toHaveProperty('accessToken')
    //   const { body, status } = await supertest(app)
    //     .post('/api/trips')
    //     .set('Cookie', [`accessToken=${session.body.accessToken}`])
    //     .send(tripPayload)
    //   expect(status).toEqual(200)
    //   await new Promise((res) =>
    //     setTimeout(() => {
    //       expect(true).toBe(true)
    //       res(22)
    //     }, 2000)
    //   )
    //   //make sure that tripNode happens after 3 seconds
    //   log.info('tripNode should have been created')
    //   const tripNode = await TripNodeModel.find({})
    //   expect(tripNode).toBe(1)
    // })
  })
})
