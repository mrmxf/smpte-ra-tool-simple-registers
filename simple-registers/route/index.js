/** @module index */
/**
 *  return index page for a register
 *
 * load index.template and use mustache to update
 *
*/
const path = require('path')
const Router = require('koa-router')
const router = new Router();
config = require('../cfg-va-che/cfg-va-che.js')
const log = require('pino')(config.get('logging'))

const lmt_body = require('../inc/lib-body')

const thisRoute = `/`

router.get(thisRoute, (ctx, next) => {
    //create the data structure for the home page
    const document_root = config.get(`path.document_root`)
    const narrative_md = config.get(`path.home_narrative`)

    home_config = {
        narrative: path.join(document_root, narrative_md),
        config
    }
    let view_data = lmt_body.get_view_data(home_page)

    let rendering = lmt_body.body(view_data)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${thisRoute}`)
    } else {
        log.error(`${rendering.status} route:${thisRoute}`)
    }
});

module.exports = router