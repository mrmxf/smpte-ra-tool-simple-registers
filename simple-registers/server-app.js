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

//pull in any credentials from the .env file into process.env
require('dotenv').config()
const config = require('./cfg-va-che/cfg-va-che.js')
const DEBUG= config.get("DEBUG")
const pino = require('pino')
//log to stderr by default
const log = pino(config.get('logging'), pino.destination(2))

//required libraries for koa server, router and url mount
const Koa = require('koa')
const bodyParser = require('koa-body')
const mount = require('koa-mount')
const request_logger = require('koa-pino-logger')

/** the unique app object that will listen on a given port */
const app = new Koa();

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

//mount the app with the desired prefix (and force a leading slash)
const raw_prefix = config.get('url_prefix')
const prefix = `${(raw_prefix[0] == "/") ? "" : "/"}${raw_prefix}`

/* =========  define the app behaviour, routes and map the functions  ================================  */

//enable logging
if (config.get('logging.log_requests'))
  app.use(request_logger())

//do some pre-processing so that the correct register is mapped to the correct route
app.use(require('./inc/register-middleware'))

//enable file uploads for the conversion tool using koa-body
app.use(bodyParser({
  formidable: { uploadDir: config.get("upload_folder")},    //This is where the files would come
  multipart: true,
  urlencoded: true
}));

//>>> serve static pages as defined in config
const serve = require('koa-static')
app.use(mount(prefix, serve(config.get('static.root'), { index: "index.html", })))

//>>> serve metadata for the ui
app.use(mount(prefix, require('./route/metadata').routes()))

//>>> serve index page
app.use(mount(prefix, require('./route/index').routes()))

//>>> serve the views from the buttons
// app.use(mount(prefix, require('./route/xml').routes()))
// app.use(mount(prefix, require('./route/xsd').routes()))

// app.use(mount(prefix, require('./route/view-control-doc').routes()))
// app.use(mount(prefix, require('./route/view-xml').routes()))
// app.use(mount(prefix, require('./route/view-schema').routes()))

// app.use(mount(prefix, require('./route/table-lang').routes()))
// app.use(mount(prefix, require('./route/table-group').routes()))

// app.use(mount(prefix, require('./route/tool-diff').routes()))
// app.use(mount(prefix, require('./route/tool-validate').routes()))

// app.use(mount(prefix, require('./route/tool-convert').routes()))

module.exports = app