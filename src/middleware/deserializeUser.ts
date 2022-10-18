import { verify } from 'crypto'
import {Request, Response, NextFunction} from 'express'
import { get } from 'lodash'
import { reIssureAccessToken } from '../service/session.service'
import { verifyJwt } from '../utils/jwt.utils'

 async function deserializeUser (req: Request, res: Response, next: NextFunction) {
   const accessToken = get(req, 'headers.authorization', '').replace('Bearer ', '')
   const refreshToken = get(req, 'headers.x-refresh', '')
  if (!accessToken) {
    return next()
  }
  const { decoded, expired } = verifyJwt(accessToken)
  if (decoded) {
    res.locals.user = decoded
    return next()
  }
   if (expired && refreshToken) {
     const newAccessToken = await reIssureAccessToken({ refreshToken })
   
     if (newAccessToken) {
       res.setHeader('x-access-token', newAccessToken)
     }
     const result = verifyJwt(newAccessToken as string);
     res.locals.user = result.decoded
     return next()
    }

  return next()
}

export default deserializeUser 