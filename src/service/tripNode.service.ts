//services for tripNode, just like the trip.service.ts file using the proper types

import TripNodeModel, { ITripNodeInput } from '../models/tripNode.model'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import log from '../utils/logger'

export async function createTripNode(input: ITripNodeInput) {
  try {
    const tripNode = await TripNodeModel.create(input)
    return tripNode
  } catch (err) {
    log.error(err)
    throw err
  }
}

export async function findTripNode(query: FilterQuery<ITripNodeInput>, options: QueryOptions = { lean: true }) {
  return TripNodeModel.findOne(query, {}, options)
}

export async function findTripNodes(query: FilterQuery<ITripNodeInput>, options: QueryOptions = { lean: true }) {
  return TripNodeModel.find(query, {}, options)
}

export async function findAndUpdateTripNode(
  query: FilterQuery<string>,
  update: UpdateQuery<ITripNodeInput>,
  options: QueryOptions
) {
  return TripNodeModel.findOneAndUpdate(query, update, options)
}

export async function deleteTripNode(query: FilterQuery<ITripNodeInput>) {
  return TripNodeModel.deleteOne(query)
}
