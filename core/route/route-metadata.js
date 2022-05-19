/** @module core */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** return metadata for the client */
const Router = require('koa-router')
const router = new Router();
config = require(__smr+'/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))

const thisRoute = `/metadata`

router.get(thisRoute, (ctx, next) => {
    ctx.status = 200
    ctx.set('Content-Type', 'application/json')
    ctx.body = JSON.stringify(ctx.smr, undefined, 2);
    log.info(`${ctx.status} route:${thisRoute}`)
})

module.exports = router