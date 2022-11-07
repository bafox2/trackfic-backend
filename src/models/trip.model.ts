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
  }
)

// var job = new CronJob(
//   '0-59 0-59 0-23 * * 0-6',
//   function () {
//     console.log('CRON is started !' + user.email)
//   },
//   function () {
//     /* This function is executed when the job stops */
//     console.log('CRON is stoped !')
//   },
//   true /* Start the job right now */
// )

// job.stop

//can possibly do a property of the trip for pause/start
//as long as there is only one instance of the cronjob running at a time, it will work
//this won't work because it is always going to be a new instance, and started
// let job: CronJob
// tripSchema.pre('save', function () {
//   if (this.isNew) {
//     job = new CronJob(this.schedule, () => {
//       log.info('tripNode should have been created')
//       const tripNode = createTripNode({
//         trip: this._id,
//         timeRequested: new Date().toISOString(),
//         durationGeneral: 0,
//         durationNow: 0,
//       })
//     })
//     job.start()
//   }
// })

// tripSchema.post('save' as any, async function (next) {
//   const trip = this._id as ITrip['_id']
//   log.info('trip pre save hook')
//   new CronJob('* * * * * *', async function () {
//     log.info('cron job running')
//     await createTripNode({
//       trip: trip,
//       timeRequested: new Date().toISOString(),
//       durationGeneral: 0,
//       durationNow: 0,
//     })
//   }).start()
// })

// tripSchema.post('save' as any, async function (next): Promise<void> {
//   const job = new CronJob(this.schedule, async () => {
//     await fetch(
//       `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.origin}&destinations=${this.destination}mode=driving&departure_time=now&key=errorAIzaSyDQaQ22jPs4WUnCh7Fp9kMdYOl1METK2GU&departure_time=now`
//     )
//       .then((res) => res.json())

//       .then((data) => {
//         console.log(data)
//         const node: ITripNodeInput = {
//           user: this.user,
//           trip: this._id,
//           date: new Date(),
//           time: new Date().toLocaleTimeString(),
//           durationGeneral: data.rows[0].elements[0].duration.value,
//           durationNow: data.rows[0].elements[0].duration_in_traffic.value,
//         }
//         //the line below is not working
//         TripNodeModel.create(node)
//       })
//   })
//   job.start()
// })

const TripModel = mongoose.model<ITrip>('Trip', tripSchema)

export default TripModel
