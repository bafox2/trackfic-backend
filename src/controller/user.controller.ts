import { Request, Response } from 'express'
import logger from '../config/logger'

export function createUser(req: Request, res: Response) {
  try {
    logger.info('Creating user')
    res.status(200).json({ message: 'User created' })
  } catch (error: Error | any) {
    // catch user because already exists
    logger.error(error)
    res.status(409).json({ message: 'User already exists' })
  }
}
