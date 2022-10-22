import mongoose, { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'
import { NextFunction } from 'express'
import { IUser } from './user.model'

export interface ISessionInput {
  user: IUser['_id']
  valid: boolean
  userAgent: string | undefined
}

export interface ISession extends ISessionInput, Document {
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const SessionModel = model<ISession>('Session', sessionSchema)

export default SessionModel
