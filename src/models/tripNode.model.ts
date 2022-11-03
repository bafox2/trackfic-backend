import mongoose from 'mongoose'
import TripModel from './trip.model'
import { IUser } from './user.model'
import { ITrip, ITripInput } from './trip.model'

export interface ITripNodeInput {
  trip: ITrip['_id']
  timeRequested: String
  durationGeneral: number
  durationNow: number
}

export interface ITripNode extends ITripNodeInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
  user: IUser['_id']
}

const nodeSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    timeRequested: { type: String, required: true },
    durationGeneral: { type: Number, required: true },
    durationNow: { type: Number, required: true },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

//write a virtual that will retrn the user of the trip
nodeSchema.virtual('user').get(async function () {
  const trip: ITrip | null = await TripModel.findById(this.trip)
  //take the promise and turn it into a user
  return trip?.user
})

const TripNodeModel = mongoose.model<ITripNode>('Node', nodeSchema)

export default TripNodeModel
