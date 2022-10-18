import { object, string } from 'zod'

export const createSessionSchema = object({
  body: object({
    email: string({required_error: 'Email is required'}).email({message: 'email must be a valid email'}),
    password: string({required_error: 'Password required'}).min(6).max(255),
  }),
})
