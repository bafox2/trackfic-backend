import { Request, Response } from 'express'
import { CreateTripInput, UpdateTripInput } from '../schema/trip.schema'
import TripModel from '../models/trip.model'
import { deleteTrip, findTrip } from '../service/trip.service'

export async function createTripHandler(req: Request<{}, {}, CreateTripInput['body']>, res: Response) {
  const userId = res.locals.user._id
  const { title, description, origin, destination } = req.body
  try {
    const trip = await TripModel.create({ user: userId, title, description, origin, destination })
    return res.status(201).send(trip)
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}

export async function updateTripHandler(req: Request<UpdateTripInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const tripId = req.params.tripId
  const update = req.body
  try {
    const trip = await findTrip({ userId, tripId })
    if (!trip) {
      return res.status(404).send('Trip not found')
    }
    if (trip.user.toString() !== userId.toString()) {
      return res.status(403).send('Not authorized')
    }
    const updatedTrip = await TripModel.findOneAndUpdate({ _id: tripId }, update, { new: true })
    return res.status(200).send(updatedTrip)
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}
export async function deleteTripHandler(req: Request<UpdateTripInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const tripId = req.params.tripId
  try {
    const trip = await findTrip({ userId, tripId })
    if (!trip) {
      return res.status(404).send('Trip not found')
    }
    if (trip.user.toString() !== userId.toString()) {
      return res.status(403).send('Not authorized')
    }
    await deleteTrip({ userId, tripId })
    return res.status(200)
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}

export async function getTripHandler(req: Request<UpdateTripInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const tripId = req.params.tripId
  try {
    const trip = await findTrip({ userId, tripId })
    if (!trip) {
      return res.status(404).send('Trip not found')
    }
    return res.status(200).send(trip)
  } catch (error: Error | any) {
    return res.status(500).send(error.message)
  }
}
