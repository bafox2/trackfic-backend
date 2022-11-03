import mongoose, { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'
import TripModel, { ITrip } from './trip.model'
import TripNodeModel, { ITripNode } from './tripNode.model'
import log from '../utils/logger'

export interface IUserInput {
  email: string
  password: string
  passwordConfirmation: string
  name: string
}

export interface IUser extends IUserInput, Document {
  createdAt: Date
  updatedAt: Date
  comparePassword: (candatePassword: string) => Promise<boolean | Error>
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
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
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

//write a virtual to get all the trips for a user
// UserSchema.virtual('trips').get(async function () {
//   log.info('getting trips for user')
//   const trips: ITrip[] = await TripModel.find({ user: this._id }, (err: any, trips: ITrip[]) => {
//     if (err) {
//       return err
//     }
//     return trips
//   })
//   return trips.map((trip: ITrip) => trip._id)
// })

const UserModel = model<IUser>('User', UserSchema)

export default UserModel
