import { Request, Response } from 'express'
import logger from '../utils/logger'
import { createUser } from '../service/user.service'
import { CreateUserInput } from '../schema/user.schema'
import { omit } from 'lodash'

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
  try {
    logger.info('Creating user')
    const user = await createUser(req.body)
    return res.status(201).send(omit(user, 'password'))
  } catch (error: Error | any) {
    // catch user because already exists
    logger.error(error)
    res.status(409).json({ message: 'User already exists' })
  }
}
