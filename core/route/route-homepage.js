/** @module core */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/**
 *  return index page for a register
 *
 * load index.template and use mustache to update
 *
 */
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const router = new Router();
const config = require(__smr+'/cfg-va-che.js')
const log = require('pino')(config.get('logging'))

const coreTemplate = require('../lib-coreTemplate')

const thisRoute = `/`

router.get(thisRoute, (ctx, next) => {
    //create the data structure for the home page
    const documentRootPath = config.get(`home.path.static`)
    const narrativeMdFilename = config.get(`home.path.narrative`)

    const homepageConfig = config.get(`home`)

    // load the default template and homepage narrative using a helper
    const narrativeHTML = coreTemplate.loadNarrativeHTML()
    const templateHTML = coreTemplate.loadTemplateHTML()

    // override the page javascript
    ctx.smr.pageJavascript = `<script src="${config.get('urlPrefix')}css_js/autoload-home.js"></script>`

    //set all the data for the template
    let viewData = coreTemplate.createTemplateData({
        ctx: ctx,
        registerConfig: homepageConfig,
        pageNarrativeHTML: narrativeHTML,
        templateHTML: templateHTML,
        menuTitleForThisPage: `<div class="ui active item">Homepage</div>`
    })

    //render the template
    const rendering = coreTemplate.renderPageData(viewData)

    //give the data to koa for serving
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${thisRoute}`)
    } else {
        log.error(`${rendering.status} route:${thisRoute}`)
    }
});

module.exports = router