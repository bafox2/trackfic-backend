import { Express, Request, Response } from 'express'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controller/session.controller'
import { createUserHandler, getCurrentUser } from './controller/user.controller'
import validate from './middleware/validate'
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
import requireUser from './middleware/requireUser'
import {
  createTripSchema,
  updateTripSchema,
  deleteTripSchema,
  getTripSchema,
  pauseTripSchema,
} from './schema/trip.schema'
import {
  createTripHandler,
  updateTripHandler,
  getTripHandler,
  deleteTripHandler,
  getTripsByUserHandler,
  getNodesbyTripsHandler,
  pauseTripHandler,
} from './controller/trip.controller'
import {
  createTripNodeHandler,
  deleteTripNodeHandler,
  getTripNodeHandler,
  updateTripNodeHandler,
} from './controller/tripNode.controller'
import {
  createTripNodeSchema,
  deleteTripNodeSchema,
  getTripNodeSchema,
  updateTripNodeSchema,
} from './schema/tripNode.schema'

function routes(app: Express) {
  app.post('/api/users', validate(createUserSchema), createUserHandler)

  app.get('/api/sessions', requireUser, getUserSessionsHandler)
  app.post('/api/sessions', validate(createSessionSchema), createUserSessionHandler)
  app.delete('/api/sessions', requireUser, deleteSessionHandler)

  app.get('/api/trips/:tripId', validate(getTripSchema), getTripHandler)
  app.post('/api/trips', [requireUser, validate(createTripSchema)], createTripHandler)
  app.put('/api/trips/:tripId', [requireUser, validate(updateTripSchema)], updateTripHandler)
  app.put('/api/trips/:tripId/pause', [requireUser, validate(pauseTripSchema)], pauseTripHandler)
  app.delete('/api/trips/:tripId', [requireUser, validate(deleteTripSchema)], deleteTripHandler)

  app.get('/api/me', requireUser, getCurrentUser)
  app.get('/api/me/trips', requireUser, getTripsByUserHandler)
  app.get('/api/me/nodes', requireUser, getNodesbyTripsHandler)

  app.get('/api/tripNodes/:tripNodeId', [requireUser, validate(getTripNodeSchema)], getTripNodeHandler)
  app.post('/api/tripNodes', [requireUser, validate(createTripNodeSchema)], createTripNodeHandler)
  app.put('/api/tripNodes/:tripNodeId', [requireUser, validate(updateTripNodeSchema)], updateTripNodeHandler)
  app.delete('/api/tripNodes/:tripNodeId', [requireUser, validate(deleteTripNodeSchema)], deleteTripNodeHandler)
}

export default routes
