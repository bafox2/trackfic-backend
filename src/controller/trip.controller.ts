import { Request, Response } from 'express'
import { CreateTripInput, UpdateTripInput, GetTripInput, DeleteTripInput, PauseTripInput } from '../schema/trip.schema'
import TripModel from '../models/trip.model'
import { deleteTrip, findTrip, findTrips } from '../service/trip.service'
import log from '../utils/logger'

export async function createTripHandler(req: Request<{}, {}, CreateTripInput['body']>, res: Response) {
  const userId = res.locals.user.user._id
  const { title, description, origin, destination, schedule } = req.body
  try {
    if (!userId) {
      return res.status(403).send({ message: 'Unauthorized, please log in' })
    }
    const trip = await TripModel.create({
      user: userId,
      title,
      description,
      origin,
      destination,
      schedule,
      active: true,
    })

    return res.status(200).send(trip)
  } catch (error: any) {
    log.error(error)
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function updateTripHandler(req: Request<UpdateTripInput['params']>, res: Response) {
  const userId = res.locals.user.user._id
  const tripId = req.params.tripId
  const update = req.body
  try {
    const trip = await TripModel.findOne({ _id: tripId })
    if (!trip) {
      return res.status(404).send({
        errors: [
          {
            message: 'Trip not found',
          },
        ],
      })
    }
    if (trip.user._id.toString() !== userId) {
      return res.status(403).send({
        errors: [
          {
            message: 'Not authorized to update this trip',
          },
        ],
      })
    }
    await trip.updateOne(update)
    await trip.save()
    return res.status(200).send(trip)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function pauseTripHandler(req: Request<PauseTripInput['params']>, res: Response) {
  const userId = res.locals.user.user._id
  const tripId = req.params.tripId
  try {
    const trip = await TripModel.findOne({ _id: tripId })
    if (!trip) {
      return res.status(404).send({
        errors: [
          {
            message: 'Trip not found',
          },
        ],
      })
    }
    if (trip.user._id.toString() !== userId) {
      return res.status(403).send({
        errors: [
          {
            message: 'Not authorized to update this trip',
            user: res.locals,
            tripUser: trip,
          },
        ],
      })
    }

    await trip.updateOne({ active: !trip.active }, { new: true })
    await trip.save()
    log.info(trip.active)
    return res.status(200).send(trip)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function deleteTripHandler(req: Request<DeleteTripInput['params']>, res: Response) {
  const userId = res.locals.user.user._id
  const tripId = req.params.tripId
  try {
    const trip = await findTrip({ userId, tripId })
    if (!userId) {
      return res.status(403).send({
        errors: [
          {
            message: 'No user found, please log in',
          },
        ],
      })
    }
    if (!trip) {
      return res.status(404).send({
        errors: [
          {
            message: 'Trip not found',
          },
        ],
      })
    }
    if (trip.user.toString() !== userId.toString()) {
      return res.status(403).send({
        errors: [
          {
            message: 'Not authorized to delete this trip',
          },
        ],
      })
    }
    await deleteTrip({ userId, tripId })
    return res.status(200).send({ message: 'Trip deleted' })
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function getTripHandler(req: Request<GetTripInput['params']>, res: Response) {
  const tripId = req.params.tripId
  try {
    const trip = await findTrip({ tripId })
    if (!trip) {
      return res.status(404).send({
        errors: [
          {
            message: 'No trup found',
          },
        ],
      })
    }
    return res.status(200).send(trip)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function getTripsByUserHandler(req: Request, res: Response) {
  const userId = res.locals.user.user._id
  log.info(userId, 'userId in getTripsByUserHandler')
  try {
    const trips = await findTrips({ user: userId })
    return res.status(200).send(trips)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function getNodesbyTripsHandler(req: Request, res: Response) {
  //this gets one all trips
  const trips = await findTrips({ user: res.locals.user.session.user })
  const tripIds = trips.map((trip) => trip._id)
  const tripsWithTheirNodes = await TripModel.aggregate([
    {
      $match: {
        _id: { $in: tripIds },
      },
    },
    {
      $lookup: {
        from: 'nodes',
        localField: '_id',
        foreignField: 'trip',
        as: 'tripNodes',
      },
    },
  ])

  return res.status(200).send(tripsWithTheirNodes)
}
