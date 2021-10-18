/** @module route-home */
/**
 * A route to return the home page (narrative) of this register
 *
 * route: <mount-point>/
 */
const path = require('path')

//helpers for this register
const menu = require('./menu')

//core components for look & feel and parent menus
const coreTemplate = require('../../../core/inc/lib-coreTemplate')

module.exports = (cfg, router) => {
    const log = cfg._log

    // GET homepage
    router.get(cfg._routes.home, async (ctx, next) => {
        const processPath = path.join(cfg._folderPath, cfg.folder.processPath)

        const narrativeMdPath = path.join(processPath, cfg.smpteProcess.narrative.current)
        const narrativeMdPathCandidate = path.join(processPath, cfg.smpteProcess.narrative.candidate)
        const narrativeMdPathPrevious = path.join(processPath, cfg.smpteProcess.narrative.previous)

        // load the default template and homepage narrative
        const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativeMdPath)
        const templateHTML = coreTemplate.loadTemplateHTML()

        let viewData = coreTemplate.createTemplateData({
            cfg: cfg,
            registerSecondaryMenu: menu.html(cfg),
            pageNarrativeHTML: narrativeHTML,
            templateHTML: templateHTML,
            menuForThisRegister: `<div class="ui active item">${cfg.menu}</div>`
        })

        const rendering = coreTemplate.renderPageData(viewData)
        ctx.body = rendering.body
        ctx.status = rendering.status

        if (rendering.status < 300) {
            log.info(`${rendering.status} route:${cfg._routes.home}`)
        } else {
            log.error(`${rendering.status} route:${cfg._routes.home}`)
        }
    })

}