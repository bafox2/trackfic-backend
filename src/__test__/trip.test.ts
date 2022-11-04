import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { createTrip } from '../service/trip.service'
import { omit } from 'lodash'
import { userInputPayload, user, tripPayload, tripDataMongoose, tripNodePayload } from './testValues.spec'
import { diff } from 'jest-diff'

const app = createServer()

describe('trip', () => {
  const userId = new mongoose.Types.ObjectId().toString()
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
        const trip = await createTrip({ ...tripPayload, user: userId })
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

  describe('/me/trips', () => {
    const userId = new mongoose.Types.ObjectId().toString()
    describe('given the user is not logged in', () => {
      it('should return a 401', async () => {
        const obj = await supertest(app).get(`/api/me/trips`)
        expect(obj.status).toEqual(401)
      })
    })

    describe('given the user is logged in', () => {
      it('should return a trip', async () => {
        await supertest(app).post('/api/users').send(userInputPayload)
        const session = await supertest(app).post('/api/sessions').send(user)
        expect(session.body).toHaveProperty('accessToken')
        const postedTrip = await supertest(app)
          .post('/api/trips')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
          .send(tripPayload)
        const postedTrip2 = await supertest(app)
          .post('/api/trips')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
          .send(tripPayload)
        expect(postedTrip.body.user).toBe(postedTrip2.body.user)
        const { body, statusCode } = await supertest(app)
          .get('/api/me/trips')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
        expect(statusCode).toEqual(200)
      })
    })
  })
  describe('/me/trips', () => {
    it('should return a trip', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const session = await supertest(app).post('/api/sessions').send(user)
      const postedTrip = await supertest(app)
        .post('/api/trips')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send(tripPayload)
      const postedTripNode = await supertest(app)
        .post('/api/trips')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send({ ...tripNodePayload, user: postedTrip.body.user })
      const { body, statusCode } = await supertest(app)
        .get('/api/me/trips')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
      expect(statusCode).toEqual(200)
      expect(body[2]).toHaveProperty('origin')
    })
  })
  describe('/me/nodes', () => {
    it('should return a trip', async () => {
      //creates user
      await supertest(app).post('/api/users').send(userInputPayload)
      //creates session
      const session = await supertest(app).post('/api/sessions').send(user)
      expect(session.body).toHaveProperty('accessToken')
      //creates trip
      const trip = await supertest(app)
        .post('/api/trips')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send({ ...tripPayload, user: session.body.user })
      expect(trip.body).toHaveProperty('user')
      //creates tripNode
      const { body, status } = await supertest(app)
        .post('/api/tripNodes')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send({ ...tripNodePayload, trip: trip.body._id })
      await supertest(app)
        .post('/api/tripNodes')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send({ ...tripNodePayload, trip: trip.body._id })
      //user isn't there
      expect(status).toEqual(200)
      // expect(body.trip).toBe(trip.body._id)
      const nodes = await supertest(app)
        .get('/api/me/nodes')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
      expect(nodes.status).toBe(200)
      expect(nodes.body[4]).toHaveProperty('tripNodes')
    })
  })
})
