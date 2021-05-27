/** @module route-xml
 *
 * return raw xml for the client
 */
const Router = require('koa-router')
const router = new Router();
config = require('./inc/config-process')
const log = require('pino')(config.get('logging'))

const lmt = require('./lib-lmt-xml')

router.get(`/xml`, (ctx, next) => {
    let xml = lmt.xml()

    if (xml) {
        ctx.status = 200
        ctx.set('Content-Type', 'application/xml')
        ctx.body = xml
        log.info(`${ctx.status} route:/xml`)
    }else{
        ctx.status = 500
        log.error(`${ctx.status} route:/xml`)
    }
})

module.exports = router