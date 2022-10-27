import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import TripNodeModel, { ITripNode } from '../models/tripNode.model'
import { createTrip } from '../service/trip.service'
import log from '../utils/logger'
import { omit } from 'lodash'

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

const tripPayload = {
  user: userId,
  title: 'Commute to work',
  description: 'My daily commute to work',
  origin: '6400 hoadly road, Virginia',
  destination: 'Hidden Spring Dr. Manassas, VA',
  schedule: '* * * * *',
}

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
      TripNodeModel.find({}, (err: any, docs: ITripNode[]) => {
        if (err) {
          log.error(err)
        }
        log.info(docs)
        expect(docs).toHaveLength(1)
      })
    })
  })
})
