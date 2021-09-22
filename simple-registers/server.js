require('dotenv').config()
config = require('./cfg-va-che/cfg-va-che.js')
const log = require('pino')(config.get('logging'))
const serverName = config.get(`serverNameShort`) + ":"

log.info(`${serverName} Initialising ${config.get(`serverName`)} (${serverName})`)
log.flush()

const app = require('./server-app.js')

const port = config.get("port")
log.info(`${serverName} Listening to http://localhost:${port} with prefix(${config.get('urlPrefix')})`)
log.info(`${serverName} --------- --------- --------- --------- --------- --------- --------- --------- --------- ---------`)
log.flush()

const server = app.listen(port)
