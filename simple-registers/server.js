config = require('./cfg-va-che/cfg-va-che.js')
const app = require('./server-app.js')

const port = config.get("port")
const server = app.listen(port)

const log = require('pino')(config.get('logging'))
const serverName = config.get(`serverName`)
log.info(`${serverName} Listening to http://localhost:${port} with prefix(${config.get('urlPrefix')})`)
log.flush()
