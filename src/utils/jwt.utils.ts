import jwt from 'jsonwebtoken'
import config from 'config'
import log from './logger'

//signing and verifying tokens
const publicKey = Buffer.from(config.get<string>('publicKeyEncoded'), 'base64').toString('ascii')
const privateKey = Buffer.from(config.get<string>('privateKeyEncoded'), 'base64').toString('ascii')

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
    log.info(error, 'verifyJwt error')
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    }
  }
}
