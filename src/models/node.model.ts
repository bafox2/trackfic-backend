import mongoose from 'mongoose'
import { IUser } from './user.model'
import { IRoute, IRouteInput } from './route.model'

export interface INodeInput {
  user: IUser['_id']
  route: IRoute['_id']
  date: Date
  time: string
  durationGeneral: number
  durationNow: number
}

export interface INode extends IRouteInput, mongoose.Document {
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

const NodeModel = mongoose.model<INode>('Node', nodeSchema)

export default NodeModel
