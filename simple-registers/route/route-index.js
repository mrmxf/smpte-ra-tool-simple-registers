/** @module route-index
 *  return index page
 *
 * load index.template and use mustache to update
 *
*/
const Router = require( 'koa-router')
const router = new Router();
config = require('./inc/config-process')
const log = require('pino')(config.get('logging'))

const lmt_body=require('./lib-body')

router.get(`/`, (ctx, next) => {
    let view_data = lmt_body.view_data

    let rendering= lmt_body.body(view_data)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300){
        log.info(`${rendering.status} route:/`)
    }else{
        log.error(`${rendering.status} route:/`)
    }
});

module.exports = router