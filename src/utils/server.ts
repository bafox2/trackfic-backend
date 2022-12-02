import express from 'express'
import deserializeUser from '../middleware/deserializeUser'
import routes from '../routes'
import cors from 'cors'
import config from 'config'
import cookieParser from 'cookie-parser'

function createServer() {
  const app = express()
  app.use(
    cors({
      //add frontend url and localhost
      origin: [config.get('clientUrl'), 'https://localhost:3000'],
      credentials: true,
    })
  )
  app.use(cookieParser())
  app.use(express.json())
  app.use(deserializeUser)
  routes(app)
  return app
}

export default createServer
