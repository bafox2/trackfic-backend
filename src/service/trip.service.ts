import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import RouteModel, { IRoute, IRouteInput } from '../models/route.model'

export async function createRoute(input: IRouteInput) {
  return RouteModel.create(input)
}
export async function findRoute(query: FilterQuery<IRoute>, options: QueryOptions = { lean: true }) {
  return RouteModel.findOne(query, {}, options)
}

export async function findAndUpdateRoute(
  query: FilterQuery<IRoute>,
  update: UpdateQuery<IRoute>,
  options: QueryOptions
) {
  return RouteModel.findOneAndUpdate(query, update, options)
}
export async function deleteRoute(query: FilterQuery<IRoute>) {
  return RouteModel.deleteOne(query)
}
