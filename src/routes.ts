import { Express, Request, Response } from 'express'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import validate from './middleware/validate'
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
import requireUser from './middleware/requireUser'
import { createTripSchema, updateTripSchema, deleteTripSchema, getTripSchema } from './schema/trip.schema'
import { createTripHandler, updateTripHandler, getTripHandler, deleteTripHandler } from './controller/trip.controller'

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))
  app.post('/api/users', validate(createUserSchema), createUserHandler)
  app.post('/api/sessions', validate(createSessionSchema), createUserSessionHandler)
  app.get('/api/sessions', requireUser, getUserSessionsHandler)
  app.delete('/api/sessions', requireUser, deleteSessionHandler)
  app.post('/api/trips', [requireUser, validate(createTripSchema)], createTripHandler)
  app.put('/api/trips', [requireUser, validate(updateTripSchema)], updateTripHandler)
  app.delete('/api/trips:tripId', [requireUser, validate(deleteTripSchema)], deleteTripHandler)
  app.get('/api/trips/:tripId', validate(getTripSchema), getTripHandler)
}
export default routes
