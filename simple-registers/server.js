config = require('./cfg-va-che/cfg-va-che.js')
const app = require('./server-app.js')

const port = config.get("port")
const server = app.listen(port)

const log = require('pino')(config.get('logging'))
const server_name = config.get(`server_name`)
log.info(`${server_name} Listening to http://localhost:${port} with prefix(${config.get('url_prefix')})`);