import mongoose from 'mongoose'
import { IUser } from './user.model'

export interface ITripInput {
  user: IUser['_id']
  title: string
  description: string
  origin: string
  destination: string
  schedule: string
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
  },
  {
    timestamps: true,
  }
)

const TripModel = mongoose.model<ITrip>('Trip', tripSchema)

export default TripModel
