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
    next()
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send([req.body, req.query, req.params, { error: e.message }])
    } else {
      log.error('unknown error', e)
    }
  }
}

export default validate
