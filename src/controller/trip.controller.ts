import { Request, Response } from 'express'
import { CreateTripInput, UpdateTripInput, GetTripInput, DeleteTripInput, PauseTripInput } from '../schema/trip.schema'
import TripModel from '../models/trip.model'
import { deleteTrip, findTrip, findTrips } from '../service/trip.service'
import log from '../utils/logger'

export async function createTripHandler(req: Request<{}, {}, CreateTripInput['body']>, res: Response) {
  const userId = res.locals.user.user._id
  log.info(userId, 'userId in createTripHandler')
  const { title, description, origin, destination, schedule } = req.body
  try {
    if (!userId) {
      return res.status(403).send({ message: 'Unauthorized, please log in' })
    }
    const trip = await TripModel.create({ user: userId, title, description, origin, destination, schedule })

    return res.status(200).send(trip)
  } catch (error: any) {
    log.error(error)
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function updateTripHandler(req: Request<UpdateTripInput['params']>, res: Response) {
  const userId = res.locals.user._id
  const tripId = req.params.tripId
  const update = req.body
  try {
    const trip = await findTrip({ userId, tripId })
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
            message: 'Not authorized to update this trip',
          },
        ],
      })
    }
    const updatedTrip = await TripModel.findOneAndUpdate({ _id: tripId }, update, { new: true })
    return res.status(200).send(updatedTrip)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

export async function pauseTripHandler(req: Request<PauseTripInput['params']>, res: Response) {
  const userId = res.locals.user.user._id
  const tripId = req.params.tripId
  try {
    const trip = await findTrip({ _id: tripId })
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
    const updatedTrip = await TripModel.findOneAndUpdate({ _id: tripId }, { active: !trip.active }, { new: true })
    return res.status(200).send(updatedTrip)
  } catch (error: Error | any) {
    return res.status(500).send({ errors: [{ message: error.message || 'Internal server error' }] })
  }
}

// let bodymessage = {
//   errors: [
//     {
//       message: 'Not authorized to update this trip',
//       tripUser: {
//         __v: 0,
//         _id: '63690449e49965e95270254d',
//         active: true,
//         createdAt: '2022-11-07T13:12:41.749Z',
//         description: 'My daily commute to work',
//         destination: 'Hidden Spring Dr. Manassas, VA',
//         origin: '6400 hoadly road, Virginia',
//         schedule: '* * * * *',
//         title: 'Commute to work',
//         updatedAt: '2022-11-07T13:12:41.749Z',
//         user: '63690449e49965e952702549',
//       },
//       user: {
//         user: {
//           exp: 1667827662,
//           iat: 1667826762,
//           session: {
//             __v: 0,
//             _id: '6369044ae49965e95270255a',
//             createdAt: '2022-11-07T13:12:42.050Z',
//             updatedAt: '2022-11-07T13:12:42.050Z',
//             user: '63690449e49965e952702550',
//             userAgent: '',
//             valid: true,
//           },
//           user: {
//             __v: 0,
//             _id: '63690449e49965e952702550',
//             createdAt: '2022-11-07T13:12:41.791Z',
//             email: 'jane@gmail.com',
//             id: '63690449e49965e952702550',
//             name: 'Jane Doe',
//             password: '$2b$10$zG6VzgeKG0xn4ewufJSpFeymfrn/04kdgBDErXP5xo8.9vPNbUidS',
//             updatedAt: '2022-11-07T13:12:41.791Z',
//           },
//         },
//       },
//     },
//   ],
// }
// let treslocal = user: {
//   "user": {
//     "_id": "63690449e49965e952702550",
//     "email": "jane@gmail.com",
//     "password": "$2b$10$zG6VzgeKG0xn4ewufJSpFeymfrn/04kdgBDErXP5xo8.9vPNbUidS",
//     "name": "Jane Doe",
//     "createdAt": "2022-11-07T13:12:41.791Z",
//     "updatedAt": "2022-11-07T13:12:41.791Z",
//     "__v": 0,
//     "id": "63690449e49965e952702550"
//       },
//   "session": {
//     "user": "63690449e49965e952702550",
//     "valid": true,
//     "userAgent": "",
//     "_id": "6369044ae49965e952702574",
//     "createdAt": "2022-11-07T13:12:42.537Z",
//     "updatedAt": "2022-11-07T13:12:42.537Z",
//     "__v": 0
//       },
//   "iat": 1667826762,
// }

export async function deleteTripHandler(req: Request<DeleteTripInput['params']>, res: Response) {
  const userId = res.locals.user._id
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
    return res.status(200)
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
