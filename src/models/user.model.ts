import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'
import { string } from 'zod'
import { NextFunction } from 'express'

//alert: can use typegoose or something here
export interface UserDocument extends mongoose.Document {
  email: string
  name: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema(
  {
    email: { type: string, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next: NextFunction) {
  let user = this as UserDocument
  if (!user.isModified('paassword')) {
    return next()
  }
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel
