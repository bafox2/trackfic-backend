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
    schedule: string({
      required_error: 'Schedule is required',
    }),
  }),
}

const params = {
  params: object({
    tripId: string({
      required_error: 'Trip Id is required',
    }),
  }),
}

export const createTripSchema = object({
  ...payload,
})
export const updateTripSchema = object({
  ...payload,
  ...params,
})
export const deleteTripSchema = object({
  ...params,
})
export const getTripSchema = object({
  ...params,
})
export const pauseTripSchema = object({
  ...params,
})

//we need these because types cannot be used as values
export type CreateTripInput = TypeOf<typeof createTripSchema>
export type UpdateTripInput = TypeOf<typeof updateTripSchema>
export type DeleteTripInput = TypeOf<typeof deleteTripSchema>
export type GetTripInput = TypeOf<typeof getTripSchema>
export type PauseTripInput = TypeOf<typeof pauseTripSchema>
