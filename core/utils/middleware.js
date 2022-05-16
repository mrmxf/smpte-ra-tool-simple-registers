/** @module middleware */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/**
 * Load in the simple register middleware onto ctx.srt
 * 
 *  This should be the first middleware in the list!
 *
 * Properties are passed in `ctx.smpte`.Examples below
 *   use         ctx.request.path = "/draft/register/lmt/table_view"
 *   and config.get("urlPrefix") = "/draft/register"
 *
 * Data:
 *  `ctx.srt.request.path`     - path with config(urlPrefix) removed or false. e.g. "/lmt/table_view"
 *  `ctx.srt.request.endpoint` - path with config(urlPrefix) removed or false e.g. "/table_view""
 */
 const fs = require('fs')
 const path = require('path')
 
 const config = require('../cfg-va-che/cfg-va-che.js')
 const DEBUG = config.get("DEBUG")
 const log = require('pino')(config.get('logging'))
 let registers = require('../inc/lib-registers')
 
 module.exports = async (ctx, next) => {
    //add the path metadata without the urlPrefix
    require("./data-utils/request-path")(ctx)

    //add  in the helper functions
    ctx.srt.workflow= require("./ui-utils/ui-page-file-workflow")
    await next()
 }
 