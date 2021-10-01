/**
 *  @module  seerver-app
 *  @author  Mr MXF
 *
 * A very simple Koa Server to do the following:
 *  - Render a register into a number of different views
 *  - Create a simple index for a register
 *  - Validate a register
 *  - Execute register specific plugins
 *
 * Implements (for each register <root>)
 *  - <root>/           index page to show lmt-narrative.md + color coded xml
 *  - <root>/current    return current version of a register
 *  - <root>/previous   return previous version of a register
 *  - <root>/candidate  return next candidate version of a register
 *  - <root>/validate   validate the register
 *  - <root>/PLUGIN     plugin specific endpoint for this register
 *
 * Requires
 *  - Node v12.x or higher
 *  - Linux host (so that LibXML compiles properly)
 *  - production destination for pino logging otherwise it will be trashed
 *  - pm2 or similar to control execution - see README.md
 */
/* jshint node: true */
'use strict'
const fs = require('fs')
const path = require('path')

const config = require('./cfg-va-che/cfg-va-che.js')
const log = require('pino')(config.get('logging'))
const serverName = config.get(`serverNameShort`) + ":"

const DEBUG = config.get("DEBUG")

//required libraries for koa server, router and url mount
const Koa = require('koa')
const bodyParser = require('koa-body')
const mount = require('koa-mount')
const requestLogger = require('koa-pino-logger')

/** the unique app object that will listen on a given port */
const app = new Koa();

/** pull in the registers helper */
const registers = require('./inc/lib-registers')

/** put everything behind HTTP AUTH if the environemnt forces it */
if (process.env.hasOwnProperty('HTTP_USER') && process.env.hasOwnProperty('HTTP_PASSWORD')) {
  const auth = require('koa-basic-auth');
  app.use(auth({
    name: process.env.HTTP_USER,
    pass: process.env.HTTP_PASSWORD
  }));
}

//assume production unless specified in .env
process.env.NODE_ENV = (undefined == process.env.NODE_ENV) ? 'production' : process.env.NODE_ENV

//readability variables
const appTitle = config.get('home.appTitle')

//mount the app with the desired prefix (and force a leading slash)
const rawPrefix = config.get('urlPrefix')
const mountPrefix = `${(rawPrefix[0] == "/") ? "" : "/"}${rawPrefix}`
log.info(`${serverName} Mounting app (${appTitle}) with url prefix '${mountPrefix}''`)

/* =========  define the app behaviour, routes and map the functions  ================================  */

//>>> create a list of all routers for debugging
const allRouters = []

//>>> enable logging if config says so
if (config.get('logging.logRequests')) {
  log.info(`${serverName} logging all requests (see config)`)
  app.use(requestLogger())
}

//>>> Add metadata to ctx with smpte middleware
//    this does the parsing to that each plugin has an easy(ish) time
const smpteMiddleware = require('./inc/smpte-middleware')
app.use(smpteMiddleware)

//>>> enable file uploads
app.use(bodyParser({
  formidable: {
    uploadDir: config.get("uploadFolderPath")
  }, //This is where the files would come
  multipart: true,
  urlencoded: true
}));

//>>> serve metadata for the ui
app.use(mount(mountPrefix, require('./route/route-metadata').routes()))

//>>> iterate through active registers
for (let registerName in registers) {
  let register = registers[registerName]

  try {
    //initialise the plugin with its config as a simple object (no need for config.get)
    register.plugin.init(register.cfg)
    //add in the routes (all prefixes handled by plugin)
    app.use(register.plugin.router.routes())
    log.info(`${serverName} plugin loaded: ${registerName}`)
    //add the router to the list so that we can report on available routes
    allRouters.push(register.plugin.router)
  } catch (err) {
    log.error(`${serverName} plugin failed to load: ${registerName}`)
    log.debug(err)
  }
}

//>>> serve home page
const routeHomePage = require('./route/route-homepage')
allRouters.push(routeHomePage)
app.use(mount(mountPrefix, routeHomePage.routes()))

//>>> serve a static pages if route has not been handled
app.use(mount(mountPrefix, require('koa-static')(config.get('home.path.static'), {
  index: "index.html",
})))

//Log all registered routes
allRouters.map(r => r.stack.map(
  i => log.info(`${serverName} route registered: ${i.path + i.regexp.toString()}`)
))

module.exports = app