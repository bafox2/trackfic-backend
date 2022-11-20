import express from 'express'
import deserializeUser from '../middleware/deserializeUser'
import routes from '../routes'
import cors from 'cors'
import config from 'config'
import cookieParser from 'cookie-parser'
console.log(process.env.clientUrl, 'process.env.clientUrl')
console.log(config.get('clientUrl'), 'config.get(clientUrl)')
console.log(process.env.CLIENT_URL, 'process.env.CLIENT_URL')
console.log(config.get('CLIENT_URL'), 'config.get(CLIENT_URL)')

function createServer() {
  const app = express()
  app.use(
    cors({
      origin: config.get('clientUrl'),
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
