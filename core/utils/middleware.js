/** @module utils */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/**
 * Load in the simple register middleware onto ctx.smr
 * 
 *  This should be the first middleware in the list!
 *
 * Properties are passed in `ctx.smr`.Examples below
 *   use         ctx.request.path = "/draft/register/lmt/table_view"
 *   and config.get("urlPrefix") = "/draft/register"
 *
 * Data:
 *  `ctx.smr.request.path`     - path with config(urlPrefix) removed or false. e.g. "/lmt/table_view"
 *  `ctx.smr.request.endpoint` - path with config(urlPrefix) removed or false e.g. "/table_view""
 */
const fs = require('fs')
const path = require('path')

const config = require(__smr+'/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))
const registers = require('../lib-registers')

const requestMetadata = require("./request-path")

const uiPageFileWorkflow = ("./ui-utils/ui-page-file-workflow")

module.exports = async (ctx, next) => {
   //add the path metadata without the urlPrefix
   requestMetadata(ctx)

   //add in the helper functions
   ctx.smr.workflow = uiPageFileWorkflow
   await next()
}
