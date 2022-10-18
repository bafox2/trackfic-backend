import jwt from 'jsonwebtoken';
import config from 'config'; 

//signing and verifying tokens
const publicKey = config.get<string>('publicKey');
const privateKey = config.get<string>('privateKey');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined): string {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey)
    return{
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: Error | any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null
    }
  }
}