import jwt from 'jsonwebtoken'
import config from 'config'
import log from './logger'

//signing and verifying tokens
const publicKey = config.get<string>('publicKey')
const privateKey = config.get<string>('privateKey')

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  try {
    const signedObj = jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: 'RS256',
    })
    return signedObj
  } catch (error: Error | any) {
    log.error(error, 'signJwt error')
    throw new Error(error)
  }
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey)
    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (error: Error | any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    }
  }
}
