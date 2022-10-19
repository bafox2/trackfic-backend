import { object, string, number, TypeOf } from 'zod'

const payload = {
  body: object({
    title: string({
      required_error: 'Title is required',
    }),
    description: string(),
    origin: string({
      required_error: 'Origin is required',
    }),
    destination: string({
      required_error: 'Destination is required',
    }),
  }),
}

const params = {
  params: object({
    routeId: string({
      required_error: 'Route ID is required',
    }),
  }),
}

export const createRouteSchema = object({
  ...payload,
})
export const updateRouteSchema = object({
  ...payload,
  ...params,
})
export const deleteRouteSchema = object({
  ...params,
})
export const getRouteSchema = object({
  ...params,
})

export type CreateRouteInput = TypeOf<typeof createRouteSchema>
export type UpdateRouteInput = TypeOf<typeof updateRouteSchema>
export type DeleteRouteInput = TypeOf<typeof deleteRouteSchema>
export type GetRouteInput = TypeOf<typeof getRouteSchema>
