import mongoose from 'mongoose'
import { IUser } from './user.model'
import { ITrip, ITripInput } from './trip.model'

export interface ITripNode {
  user: IUser['_id']
  trip: ITrip['_id']
  date: Date
  time: string
  durationGeneral: number
  durationNow: number
}

export interface ITripNode extends ITripInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}

const nodeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: false },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const NodeModel = mongoose.model<ITripNode>('Node', nodeSchema)

export default NodeModel
