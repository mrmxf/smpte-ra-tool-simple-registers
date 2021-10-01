/** @module register-middleware */
/** create context settings to help downstream registers.
 *  This should be the first middleware in the list!
 *
 * Properties are passed in `ctx.smpte`.Examples below
 *   use         ctx.request.path = "/draft/register/lmt/table_view"
 *   and config.get("urlPrefix") = "/draft/register"
 *
 *  `ctx.smpte.request.path`     - path with config(urlPrefix) removed or false. e.g. "/lmt/table_view"
 *  `ctx.smpte.request.endpoint` - path with config(urlPrefix) removed or false e.g. "/table_view""
 */
const fs = require('fs')
const path = require('path')

const config = require('../cfg-va-che/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))
let registers = require('../inc/lib-registers')

async function middleware(ctx, next) {
    const p = config.get('urlPrefix')
    let m = {
        server: {
            name: config.get('serverName'),
            shortName: config.get('serverNameShort'),
        },
        register: {},
        prefix: p,
        request: {
            path: false,
            endpoint: false
        }
    }
    //make some useful paths
    m.request.path = ((p.length == 0) || (ctx.request.path.startsWith(p))) ? ctx.request.path.slice(m.prefix.length) : false
    if (m.request.path) {
        for (let registerName in registers) {
            let register = registers[registerName]
            let cfg = register.cfg
            if (m.request.path.startsWith(register._absRoute)) {
                m.request.endpoint = register._absRoute
                m.folderPath = cfg.folder.pluginPath
            }
        }
    }

    ctx.smpte = m
    if (DEBUG) log.debug(m, "SMPTE middleware metadata")

    await next()
}

module.exports = middleware