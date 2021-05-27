config = require('./inc/config-process')
const app = require('./server-app.js')

const port = process.env.PORT || 3000;
const server = app.listen(port)

const log = require('pino')(config.get('logging'))
log.info(`LMT Server Listening to http://localhost:${port} with prefix(${config.get('url_prefix')})`);