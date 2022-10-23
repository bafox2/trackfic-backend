import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import TripModel, { ITrip, ITripInput } from '../models/trip.model'
import log from '../utils/logger'

export async function createTrip(input: ITripInput) {
  return TripModel.create(input)
}
export async function findTrip(query: FilterQuery<ITrip>, options: QueryOptions = { lean: true }) {
  return TripModel.findOne(query, {}, options)
}

export async function findAndUpdateTrip(query: FilterQuery<ITrip>, update: UpdateQuery<ITrip>, options: QueryOptions) {
  return TripModel.findOneAndUpdate(query, update, options)
}
export async function deleteTrip(query: FilterQuery<ITrip>) {
  return TripModel.deleteOne(query)
}
