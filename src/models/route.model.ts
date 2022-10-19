import mongoose from 'mongoose'
import { IUser } from './user.model'

export interface IRouteInput {
  user: IUser['_id']
  title: string
  description: string
  price: number
  image: string
}

export interface IRoute extends IRouteInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}

const routeSchema = new mongoose.Schema(
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

const RouteModel = mongoose.model<IRoute>('Route', routeSchema)

export default RouteModel
