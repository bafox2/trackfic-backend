import mongoose from 'mongoose'
import { IUser } from './user.model'
import { CronJob } from 'cron'
import TripNodeModel, { ITripNode, ITripNodeInput } from './tripNode.model'
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
}

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: false },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    schedule: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

// tripSchema.pre('save' as any, async function (next): Promise<void> {
//   await fetch(
//     `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.origin}&destinations=${this.destination}mode=driving&departure_time=now&key=AIzaSyDQaQ22jPs4WUnCh7Fp9kMdYOl1METK2GU&departure_time=now`
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data)
//       const node: ITripNodeInput = {
//         user: this.user,
//         trip: this._id,
//         date: new Date(),
//         time: new Date().toLocaleTimeString(),
//         durationGeneral: data.rows[0].elements[0].duration.value,
//         durationNow: data.rows[0].elements[0].duration_in_traffic.value,
//       }
//       //the line below is not working
//       TripNodeModel.create(node)
//     })
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

//if i make the cronjob change each time the model is saved, i don't need to access the cronjob itself

const TripModel = mongoose.model<ITrip>('Trip', tripSchema)

export default TripModel
