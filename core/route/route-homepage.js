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
const registers = require('../inc/lib-registers')
const log = require('pino')(config.get('logging'))

const coreTemplate = require('../inc/lib-coreTemplate')

const thisRoute = `/`

router.get(thisRoute, (ctx, next) => {
    //create the data structure for the home page
    const documentRootPath = config.get(`home.path.static`)
    const narrativeMdFilename = config.get(`home.path.narrative`)

    const homepageConfig = config.get(`home`)

    // load the default template and homepage narrative
    const narrativeHTML = coreTemplate.loadNarrativeHTML()
    const templateHTML = coreTemplate.loadTemplateHTML()

    let viewData = coreTemplate.createTemplateData({
        ctx: ctx,
        registerConfig: homepageConfig,
        pageNarrativeHTML: narrativeHTML,
        templateHTML: templateHTML,
        menuTitleForThisPage: `<div class="ui active item">Homepage</div>`
    })

    const rendering = coreTemplate.renderPageData(viewData)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${thisRoute}`)
    } else {
        log.error(`${rendering.status} route:${thisRoute}`)
    }
});

module.exports = router