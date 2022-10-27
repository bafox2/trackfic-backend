import mongoose from 'mongoose'
import { IUser } from './user.model'
import { ITrip, ITripInput } from './trip.model'

export interface ITripNodeInput {
  user: IUser['_id']
  trip: ITrip['_id']
  date: Date
  durationGeneral: number
  durationNow: number
}

export interface ITripNode extends ITripNodeInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}

const nodeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    durationGeneral: { type: Number, required: true },
    durationNow: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
)

const TripNodeModel = mongoose.model<ITripNode>('Node', nodeSchema)

export default TripNodeModel
