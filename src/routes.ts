import { Express, Request, Response } from 'express'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import validate from './middleware/validate'
import { createSessionSchema } from './schema/session.schema'
import { createUserSchema } from './schema/user.schema'
import requireUser from './middleware/requireUser'
import { createRouteSchema, updateRouteSchema, deleteRouteSchema, getRouteSchema } from './schema/route.schema'
import {
  createRouteHandler,
  updateRouteHandler,
  getRouteHandler,
  deleteRouteHandler,
} from './controller/route.controller'

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))
  app.post('/api/users', validate(createUserSchema), createUserHandler)
  app.post('/api/sessions', validate(createSessionSchema), createUserSessionHandler)
  app.get('/api/sessions', requireUser, getUserSessionsHandler)
  app.delete('/api/sessions', requireUser, deleteSessionHandler)
  app.post('api/routes', [requireUser, validate(createRouteSchema)], createRouteHandler)
  app.put('api/routes', [requireUser, validate(updateRouteSchema)], updateRouteHandler)
  app.delete('api/routes:routeID', [requireUser, validate(deleteRouteSchema)], deleteRouteHandler)
  app.get('api/routes/:routeID', [requireUser, validate(getRouteSchema)], getRouteHandler)
}
export default routes
