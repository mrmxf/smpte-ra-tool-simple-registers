require('dotenv').config()
config = require('./cfg-va-che/cfg-va-che.js')
const app = require('./server-app.js')

const log = require('pino')(config.get('logging'))
const serverName = config.get(`serverName`)
const port = config.get("port")
log.info(`${serverName} Listening to http://localhost:${port} with prefix(${config.get('urlPrefix')})`)
log.flush()

const server = app.listen(port)
