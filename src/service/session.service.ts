import { FilterQuery, UpdateQuery } from "mongoose"
import {get } from 'lodash'
import SessionModel, { ISession } from "../models/session.model"
import { findUser } from "./user.service"
import { signJwt, verifyJwt } from "../utils/jwt.utils"
import config from 'config'

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent })
  return session.toJSON()
}

export async function findSessions(query: FilterQuery<ISession>) {
  return SessionModel.find(query).lean()
}

export async function updateSession(query: FilterQuery<ISession>, update: UpdateQuery<ISession>) {
  return SessionModel.updateOne(query, update).lean()
}

export async function reIssureAccessToken ({ refreshToken }: { refreshToken: string }) {
  // 1. Verify refresh token
  // 2. if valid, create access token
  // 3. send back access token
  const { decoded } = verifyJwt(refreshToken)
  if (!decoded || !get(decoded, 'session')) {
    return false
  }
  const session = await SessionModel.findById(get(decoded, "session"))
  if (!session || !session?.valid) {
    return false
  }
  const user = await findUser({ _id: session.user })
  if (!user) {
    return false
  }
  const accessToken = signJwt({ ...user, session: session._id }, { expiresIn: config.get('accessTokenTtl') })
  return accessToken
  
}