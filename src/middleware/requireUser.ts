import { Request, Response, NextFunction } from 'express'
import log from '../utils/logger'

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.status(401).send({
      errors: [
        {
          message: 'Unauthorized',
        },
      ],
    })
  }
  next()
}

export default requireUser
