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
const config = require('../cfg-va-che/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))

const fs = require('fs')
const path = require('path')

const middleware = async (ctx, next) => {
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
        config.get("registers").forEach(register => {
            if (m.request.path.startsWith(m.register[register.urlPrefix])) {
                m.request.endpoint = m.request.path.slice(register.urlPrefix.length)
                m.folderPath = register.folderPath
                m.register.register
            }
        })
    }

    ctx.smpte = m
    if (DEBUG) log.debug(m, "SMPTE middleware metadata")

    await next()
}

module.exports = middleware