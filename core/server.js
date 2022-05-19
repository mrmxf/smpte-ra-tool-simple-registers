/** @module core */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Launch the server
 * 
 * This is a simple wrapper that:
 * - initialises the config object
 * - initialises the logger
 * - declare a helper global variable
 * - initialises the server-app
 * - starts the server on the configured port
 */

path = require(`path`)

//helper globals to require() something in the core or registers folders:
global.__smr = __dirname
global.__smregisters = path.join(__smr, "..", "registers")
global.__smregisters = path.resolve(__smregisters)

//initialise configuration
require('dotenv').config()
config = require('./cfg-va-che.js')

//initialise the loggger
const log = require('pino')(config.get('logging'))
const serverName = config.get(`serverNameShort`) + ":"

log.info(`${serverName} Initialising ${config.get(`serverName`)} (${serverName})`)
log.flush()

//initialise the server
const app = require('./server-app.js')

const port = config.get("port")
log.info(`${serverName} --------- --------- --------- --------- --------- --------- --------- --------- --------- ---------`)
log.info(`${serverName} Listening to http://localhost:${port} with url prefix(${config.get('urlPrefix')})`)
log.info(`${serverName} --------- --------- --------- --------- --------- --------- --------- --------- --------- ---------`)
log.flush()

const server = app.listen(port)
