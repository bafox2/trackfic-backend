import mongoose from 'mongoose'
import { IUser } from './user.model'
import { CronJob } from 'cron'
import TripNodeModel, { ITripNode, ITripNodeInput } from './tripNode.model'
import { createTripNode } from '../service/tripNode.service'
import log from '../utils/logger'
import config from 'config'

export interface ITripInput {
  user: IUser['_id']
  title: string
  description?: string
  schedule: string
  origin: string
  destination: string
}

export interface ITrip extends ITripInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
  active: boolean
}

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: false },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    schedule: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
  }
)

let job = new CronJob(
  '0 0 0 * * *',
  async () => {
    log.info('running cron job')
  },
  null,
  true,
  config.get('timezone')
)

tripSchema.virtual('nextTick').get(function () {
  // could generate a whole job and then ONLY return the nextDate() method
  return job.nextDate()
})

// attempting to edit a singular cronjob
tripSchema.post('save' as any, async function () {
  const trip = this as ITrip
  if (job) {
    job.stop()
  }
  log.info(`trip ${this._id} has been saved and is ${trip.active}`)

  if (trip.origin && trip.destination && trip.schedule) {
    job = new CronJob(trip.schedule, async function () {
      log.info(`starting at ${trip.origin} and ending at ${trip.destination}`)

      await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${trip.origin}&destinations=${
          trip.destination
        }mode=driving&departure_time=now&key=${config.get('googleAPIKey')}&departure_time=now`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          const node: ITripNodeInput = {
            trip: trip._id,
            timeRequested: new Date().toLocaleTimeString(),
            durationGeneral: data.rows[0].elements[0].duration.value,
            durationNow: data.rows[0].elements[0].duration_in_traffic.value,
          }
          createTripNode(node)
        })
      log.info(`trip ${trip._id} has created a new node`)
    })
    if (!this.active) {
      log.info('stopping cron job')
      job.stop()
    }
    if (this.active) {
      log.info('starting cron job')
      job.start()
    }
  }
})

const TripModel = mongoose.model<ITrip>('Trip', tripSchema)

export default TripModel
