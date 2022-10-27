import { Request, Response } from 'express'
import log from '../utils/logger'
import { createUser } from '../service/user.service'
import { CreateUserInput } from '../schema/user.schema'
import { omit } from 'lodash'

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
  try {
    const user = await createUser(req.body)
    return res.status(201).send(omit(user, 'password'))
  } catch (error: any) {
    return res.status(400).send({
      errors: [
        {
          message: 'Error creating user',
          error: error.message,
        },
      ],
    })
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = res.locals.user
    return res.send(user)
  } catch (error: any) {
    log.error(error)
    return res.status(500).send({
      errors: [
        {
          message: 'Error getting user',
          error: error.message,
        },
      ],
    })
  }
}
