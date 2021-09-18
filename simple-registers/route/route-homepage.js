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
const config = require('../cfg-va-che/cfg-va-che.js')
const log = require('pino')(config.get('logging'))

const homepageBody = require('../inc/lib-body')

const thisRoute = `/`

router.get(thisRoute, (ctx, next) => {
    //create the data structure for the home page
    const documentRoot = config.get(`home.path.static`)
    const narrativeMd = config.get(`home.path.narrative`)

   const  homepageConfig = {
        narrative: path.join(documentRoot, narrativeMd),
        config
    }
    let view_data = homepageBody.getPageData(homepageConfig)

    let rendering = homepageBody.renderPageData(view_data)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${thisRoute}`)
    } else {
        log.error(`${rendering.status} route:${thisRoute}`)
    }
});

module.exports = router