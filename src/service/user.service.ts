import { DocumentDefinition } from 'mongoose'
import UserModel, { UserDocument } from '../models/user.model'

export async function createUser(input: DocumentDefinition<User>): Promise<any> {
  try {
    return await User.create(input)
  } catch (error: Error | any) {
    throw new Error(error)
  }
}
