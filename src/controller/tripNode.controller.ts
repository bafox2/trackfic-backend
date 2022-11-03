//crud operations for a tripNode using the service functions and proper types

import { Request, Response } from 'express'
import TripModel from '../models/trip.model'
import TripNodeModel, { ITripNode } from '../models/tripNode.model'
import {
  CreateTripNodeInput,
  UpdateTripNodeInput,
  GetTripNodeInput,
  DeleteTripNodeInput,
} from '../schema/tripNode.schema'
import { createTripNode, findTripNode, findAndUpdateTripNode, deleteTripNode } from '../service/tripNode.service'
import { findUser } from '../service/user.service'
import log from '../utils/logger'

export async function createTripNodeHandler(req: Request<{}, {}, CreateTripNodeInput['body']>, res: Response) {
  const userId = res.locals.user.user._id
  log.info(userId, 'userId in createTripNodeHandler')
  const { trip, timeRequested, durationGeneral, durationNow } = req.body
  try {
    if (!userId) {
      return res.status(403).send({ message: 'Unauthorized, please log in' })
    }
    const tripNode = await TripNodeModel.create({ user: userId, trip, timeRequested, durationGeneral, durationNow })
    return res.status(200).send(tripNode)
  } catch (error: any) {
    log.error(error)
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function updateTripNodeHandler(req: Request<UpdateTripNodeInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const tripNodeId = req.params.tripNodeId
  const update = req.body
  //check if user is authorized to update this tripNode then check if tripNode exists on the trip
  try {
    if (!userId) {
      return res.status(403).send({ message: 'Unauthorized, please log in' })
    }
    const tripNode = await findTripNode({ _id: tripNodeId })
    if (!tripNode) {
      return res.status(404).send({ message: 'TripNode not found' })
    }
    //
    const updatedTripNode = await TripNodeModel.findOneAndUpdate({ _id: tripNodeId }, update, { new: true })
    return res.status(200).send(updatedTripNode)
  } catch (error: any) {
    log.error(error)
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function deleteTripNodeHandler(req: Request<DeleteTripNodeInput['params']>, res: Response) {
  const userId = res.locals.user.user._id
  const tripNodeId = req.params.tripNodeId
  const tripNode: ITripNode | null = await findTripNode({ _id: tripNodeId })
  TripModel.findById(tripNode?.trip)
    .populate('user')
    .exec((err, trip) => {
      if (err) {
        return res.status(500).send({ errors: [{ message: err.message || 'Internal server error' }] })
      }
      if (!trip) {
        return res.status(404).send({ message: 'Trip not found' })
      }
      if (trip.user._id.toString() !== userId) {
        return res.status(403).send({ message: 'Unauthorized, please log in' })
      }
      deleteTripNode({ _id: tripNodeId })
      return res.status(200).send({ message: 'TripNode deleted', tripNode })
    })
}

export async function getTripNodeHandler(req: Request<GetTripNodeInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const tripNodeId = req.params.tripNodeId
  try {
    if (!userId) {
      return res.status(401).send({ errors: [{ message: 'Unauthenticated, please log in' }] })
    }
    const tripNode = await findTripNode({ _id: tripNodeId })
    if (!tripNode) {
      return res.status(404).send({ errors: [{ message: 'TripNode not found' }] })
    }
    return res.status(200).send(tripNode)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}
