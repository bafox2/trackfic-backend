import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

async function connect() {
  const dbUri = config.get<string>('dbUri')
  try {
    await mongoose.connect(dbUri)
    log.info('db connected')
  } catch (error) {
    log.error('unable to connect')
    log.error(error)
    log.error(JSON.stringify(error))
    process.exit(1)
  }
}

export default connect
