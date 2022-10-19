import { Request, Response } from 'express'
import { CreateRouteInput, UpdateRouteInput } from '../schema/route.schema'
import RouteModel from '../models/route.model'
import { deleteRoute, findRoute } from '../service/route.service'

export async function createRouteHandler(req: Request<{}, {}, CreateRouteInput['body']>, res: Response) {
  const userId = res.locals.user._id
  const { title, description, origin, destination } = req.body
  try {
    const route = await RouteModel.create({ user: userId, title, description, origin, destination })
    return res.status(201).send(route)
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}

export async function updateRouteHandler(req: Request<UpdateRouteInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const routeId = req.params.routeId
  const update = req.body
  try {
    const route = await findRoute({ userId, routeId })
    if (!route) {
      return res.status(404).send('Route not found')
    }
    if (route.user.toString() !== userId) {
      return res.status(403).send('Not authorized')
    }
    const updatedRoute = await RouteModel.findOneAndUpdate({ _id: routeId }, update, { new: true })
    return res.status(200).send(updatedRoute)
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}
export async function getRouteHandler(req: Request<UpdateRouteInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const routeId = req.params.routeId
  try {
    const route = await findRoute({ userId, routeId })
    if (!route) {
      return res.status(404).send('Route not found')
    }
    if (route.user.toString() !== userId) {
      return res.status(403).send('Not authorized')
    }
    await deleteRoute({ userId, routeId })
    return res.status(200).=
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}
