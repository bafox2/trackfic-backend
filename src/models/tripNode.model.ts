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

const TripNodeModel = mongoose.model<ITripNode>('Node', nodeSchema)

export default TripNodeModel
