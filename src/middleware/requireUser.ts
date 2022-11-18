import { Request, Response, NextFunction } from 'express'
import log from '../utils/logger'

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user
  if (!user) {
    return res.status(401).send({
      errors: [
        {
          message: `You're not authorized to access this route, ${req.originalUrl}`,
          req: req.originalUrl,
          res: res.locals,
          cookies: req.cookies,
        },
      ],
    })
  }
  next()
}

export default requireUser
