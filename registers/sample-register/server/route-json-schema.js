/** @module route-home */
/**
 * A route to view the data as JSON
 *
 * route: <mount-point>/jsonSchema
 */
const fs = require('fs')
const path = require('path')
const Prism = require('prismjs')

//helpers for this register
const menu = require('./menu')

//core components for look & feel and parent menus
const coreTemplate = require('../../../core/inc/lib-coreTemplate')

module.exports = (cfg, router) => {
    const log = cfg._log

    // GET homepage
    router.get(cfg._routes.jsonSchema, async (ctx, next) => {
        const processPath = path.join(cfg._folderPath, cfg.folder.processPath)

        const narrativeMdPath = path.join(processPath, cfg.smpteProcess.narrative.current)

        let filename = cfg.smpteProcess.schema.current
        let filePath = path.join(cfg._folderPath, cfg.folder.processPath, filename)
        let json

        try {
            json = fs.readFileSync(filePath, 'utf8')
            json = JSON.parse(json)
            json = JSON.stringify(json, undefined, 2)
        } catch (err) {
            ctx.status = 500
            log.error(`${ctx.status} route:${cfg._routes.register}`)
            log.debug(err)
            return
        }
        //format the HTML with left and right gutters
        const prettyHTML = `<div class ="ui brown segment"><pre>` +
            Prism.highlight(json, Prism.languages.javascript, 'javascript') +
            `</pre></div>`

        // load the default template and homepage narrative
        const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativeMdPath)
        const templateHTML = coreTemplate.loadTemplateHTML()

        let viewData = coreTemplate.createTemplateData({
            registerConfig: cfg._parent.home,
            registerSecondaryMenu: menu.html(cfg, cfg._routes.jsonSchema),
            pageNarrativeHTML: narrativeHTML,
            templateHTML: templateHTML,
            menuForThisRegister: `<div class="ui active item">${cfg.menu}</div>`,
            uiView: prettyHTML
        })

        const rendering = coreTemplate.renderPageData(viewData)
        ctx.body = rendering.body
        ctx.status = rendering.status

        if (rendering.status < 300) {
            log.info(`${rendering.status} route:${cfg._routes.jsonSchema}`)
        } else {
            log.error(`${rendering.status} route:${cfg._routes.jsonSchema}`)
        }
    })

}