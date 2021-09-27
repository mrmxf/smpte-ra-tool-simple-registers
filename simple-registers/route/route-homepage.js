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

const homepageBody = require('../inc/lib-coreTemplate')

const thisRoute = `/`

router.get(thisRoute, (ctx, next) => {
    //create the data structure for the home page
    const documentRootPath = config.get(`home.path.static`)
    const narrativeMdFilename = config.get(`home.path.narrative`)

   const  homepageConfig = config

    // load the default template and homepage narrative
    let narrativeMD = homepageBody.loadNarrativeMD()
    let templateHTML = homepageBody.loadTemplateHTML()
    let viewData = homepageBody.createTemplateData(homepageConfig)

    let rendering = homepageBody.renderPageData(viewData, narrativeMD, templateHTML)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${thisRoute}`)
    } else {
        log.error(`${rendering.status} route:${thisRoute}`)
    }
});

module.exports = router