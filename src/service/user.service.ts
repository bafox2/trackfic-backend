import UserModel, { IUserInput, IUser } from '../models/user.model'
import { omit } from 'lodash'
import { FilterQuery } from 'mongoose'
import log from '../utils/logger'
export async function createUser(input: IUserInput): Promise<any> {
  try {
    const user = await UserModel.create(input)
    return omit(user.toJSON(), 'password')
  } catch (error: Error | any) {
    throw new Error(error)
  }
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
  const user = await UserModel.findOne({ email })
  if (!user) {
    return false
  }
  const isValid = await user.comparePassword(password)
  if (!isValid) {
    return false
  }
  return omit(user, 'password')
}
export async function findUser(query: FilterQuery<IUser>) {
  return UserModel.findOne(query).lean()
}
