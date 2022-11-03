import supertest from 'supertest'
import createServer from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { userInputPayload, user, tripNodePayload, tripDataMongoose, tripPayload } from './testValues.spec'
import { createTripNode } from '../service/tripNode.service'

const app = createServer()

describe('tripNode', () => {
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create()
    await mongoose.connect(mongod.getUri())
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })
  describe('tripNode Creation', () => {
    describe('given the user is not logged in', () => {
      it('should return a 401', async () => {
        const obj = await supertest(app).post(`/api/trips`)
        expect(obj.status).toEqual(401)
      })
    })
    describe('given the user is logged in', () => {
      it('given the right credentials', async () => {
        await supertest(app).post('/api/users').send(userInputPayload)
        const session = await supertest(app).post('/api/sessions').send(user)
        expect(session.body).toHaveProperty('accessToken')
        const trip = await supertest(app)
          .post('/api/trips')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
          .send(tripPayload)
        const { body, status } = await supertest(app)
          .post('/api/tripNodes')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
          .send(tripNodePayload)
        expect(status).toEqual(200)
        expect(body).toHaveProperty('_id')
      })
      it('given the right credentials', async () => {
        await supertest(app).post('/api/users').send(userInputPayload)
        const session = await supertest(app).post('/api/sessions').send(user)
        expect(session.body).toHaveProperty('accessToken')
        const { body, status } = await supertest(app)
          .post('/api/tripNodes')
          .set('Cookie', [`accessToken=${session.body.accessToken}`])
          .send(tripNodePayload)
        expect(status).toEqual(200)
        expect(body).toHaveProperty('_id')
      })
    })
  })
  describe('tripNode Deletion', () => {
    //this don't work because it is reading the wrong thing as user?
    it('given no credentials', async () => {
      const { status } = await supertest(app).delete('/api/tripNodes/2')
      expect(status).toEqual(401)
    })
    it('given the right credentials', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const session = await supertest(app).post('/api/sessions').send(user)
      expect(session.body).toHaveProperty('accessToken')
      const trip = await supertest(app)
        .post('/api/trips')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send(tripPayload)
      //there is no user attached to the trip
      const tripNode = await supertest(app)
        .post('/api/tripNodes')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send({ ...tripNodePayload, trip: trip.body._id })
      const { status, body } = await supertest(app)
        .delete(`/api/tripNodes/${tripNode.body._id}`)
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
      expect(status).toEqual(200)
    })
  })
  describe('tripNode Update', () => {
    it('given no credentials', async () => {
      const { status } = await supertest(app).put('/api/tripNodes/3')
      expect(status).toEqual(401)
    })
    it('given the right credentials', async () => {})
    it('given wrong inputs', async () => {})
  })
  describe('tripNode virtual', () => {
    //this is just making a tripNode from top to bottom
    it('works in vague usecase to be specified later', async () => {
      await supertest(app).post('/api/users').send(userInputPayload)
      const session = await supertest(app).post('/api/sessions').send(user)
      expect(session.body).toHaveProperty('accessToken')
      const { body, status } = await supertest(app)
        .post('/api/trips')
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send(tripPayload)
      expect(status).toEqual(200)
      expect(body).toHaveProperty('_id')
      const { status: status2, body: body2 } = await supertest(app)
        .post(`/api/tripNodes`)
        .set('Cookie', [`accessToken=${session.body.accessToken}`])
        .send({ ...tripNodePayload, trip: body._id })
      expect(status2).toEqual(200)
      expect(body2).toHaveProperty('_id')
    })
    it('works from the service', async () => {
      //this isn't good because the trip is not created in the db ?

      const trip = await createTripNode(tripNodePayload)
      expect(trip).toHaveProperty('_id')
    })
  })
})
