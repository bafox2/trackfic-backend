import { Request, Response } from 'express'
import { createSession, findSessions, updateSession } from '../service/session.service'
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'
import config from 'config'
import log from '../utils/logger'

export async function createUserSessionHandler(req: Request, res: Response) {
  log.info(config.get('clientUrl'), 'config.get(clientUrl)')
  const user = await validatePassword(req.body)
  if (!user) {
    return res.status(401).send({
      errors: [
        {
          message: 'Incorrect email or password',
        },
      ],
    })
  }
  const session = await createSession(user._id, req.get('User-Agent') || '')

  const accessToken = signJwt({ user, session }, { expiresIn: config.get('accessTokenTtl') })
  const refreshToken = signJwt({ session: session._id }, { expiresIn: config.get('refreshTokenTtl') })

  res.cookie('accessToken', accessToken, {
    maxAge: config.get('accessTokenTtlMs'),
    httpOnly: true,
    // domain: `${config.get('clientUrl')}/`,
    sameSite: 'strict',
    secure: false,
  })

  res.cookie('refreshToken', refreshToken, {
    maxAge: config.get('refreshTokenTtlMs'),
    httpOnly: true,
    // domain: `${config.get('clientUrl')}/`,
    sameSite: 'strict',
    secure: false,
  })

  return res.send({ accessToken, refreshToken })
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id
  const sessions = await findSessions({ user: userId, valid: true })
  return res.send(sessions)
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session
  await updateSession({ _id: sessionId }, { valid: false })
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  return res.send({ accessToken: null, refreshToken: null })
}
