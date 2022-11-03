import { object, string, number, date, TypeOf } from 'zod'

const payload = {
  body: object({
    trip: string({
      required_error: 'Trip is required',
    }),
    timeRequested: string({
      required_error: 'Time requested is required',
    }),
    durationGeneral: number({
      required_error: 'Duration general is required',
    }),
    durationNow: number({
      required_error: 'Duration now is required',
    }),
  }),
}

const params = {
  params: object({
    tripNodeId: string({
      required_error: 'TripNode Id is required',
    }),
  }),
}

export const createTripNodeSchema = object({
  ...payload,
})
export const updateTripNodeSchema = object({
  ...payload,
  ...params,
})
export const deleteTripNodeSchema = object({
  ...params,
})
export const getTripNodeSchema = object({
  ...params,
})

//we need these because types cannot be used as values
export type CreateTripNodeInput = TypeOf<typeof createTripNodeSchema>
export type UpdateTripNodeInput = TypeOf<typeof updateTripNodeSchema>
export type DeleteTripNodeInput = TypeOf<typeof deleteTripNodeSchema>
export type GetTripNodeInput = TypeOf<typeof getTripNodeSchema>
