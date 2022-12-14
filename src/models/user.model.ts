import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

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
    //check if config.get('saltWorkFactor') is a string and convert it to a number

    const salt = await bcrypt.genSalt(parseInt(config.get('saltWorkFactor')))
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
