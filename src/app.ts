import config from 'config'
import connect from './utils/connect'
import log from './utils/logger'
import createServer from './utils/server'
import dotenv from 'dotenv'
dotenv.config()

const port = config.get<number>('port')
const app = createServer()
log.info('Starting server')

app.listen(port, async () => {
  log.info(`app is running at ${port}`)
  await connect()
})
