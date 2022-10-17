import mongoose, { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'
import { NextFunction } from 'express'

export interface IUserInput {
  email: string
  password: string
  name: string
}

export interface IUser extends IUserInput, Document {
  createdAt: Date
  updatedAt: Date
  comparePassword: (candidatePassword: string) => Promise<boolean | Error>
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save' as any, async function (next): Promise<void> {
  try {
    const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    return next()
  } catch (error: Error | any) {
    return next(error)
  }
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean | Error> {
  return bcrypt.compare(candidatePassword, this.password)
}
const UserModel = model<IUser>('User', UserSchema)

export default UserModel
