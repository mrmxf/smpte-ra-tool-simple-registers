/** @module request-path */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/**
 * Load in the simple register middleware onto ctx.srt
 * 
 *  `ctx.srt.request.path`     - path with config(urlPrefix) removed or false. e.g. "/lmt/table_view"
 *  `ctx.srt.request.endpoint` - path with config(urlPrefix) removed or false e.g. "/table_view""
 */
const fs = require('fs')
const path = require('path')

const config = require('../../cfg-va-che/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))
let registers = require('../../inc/lib-registers')

module.exports = (ctx) => {
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

    ctx.srt = m
    //if (DEBUG) log.debug(m, "SMPTE middleware metadata")

}
