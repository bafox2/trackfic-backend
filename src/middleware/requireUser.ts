import { Request, Response, NextFunction } from 'express'
import log from '../utils/logger'

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.status(403)
  }
  return next()
}

export default requireUser
