import { AnyZodObject, ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'
import log from '../utils/logger'

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).send(e.message)
    } else {
      log.error('unknown error', e)
    }
  }
}

export default validate
