/** return metadata for the client */
const Router = require( 'koa-router')
const router = new Router();
config = require('./inc/config-process')
const log = require('pino')(config.get('logging'))

const metadata= {
    app_title: config.get('app_title'),
    app_description: config.get('app_description'),
    version: config.get('version'),
    prefix: config.get('url_prefix'),
}

router.get(`/metadata`, (ctx, next) => {
    ctx.status=200
    ctx.set('Content-Type', 'application/json')
    ctx.body = JSON.stringify(metadata, undefined, 2);
    log.info(`${ctx.status} route:/metadata`)
})

module.exports = router