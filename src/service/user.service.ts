import UserModel, { IUserInput } from '../models/user.model'

export async function createUser(input: IUserInput): Promise<any> {
  try {
    return await UserModel.create(input)
  } catch (error: Error | any) {
    throw new Error(error)
  }
}
