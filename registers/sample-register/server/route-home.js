/** @module route-home */
/**
 * A sample register home page
 * route: <mount-point>/
 */
const path = require('path')

//helpers for this register
const menu = require('./menu')

//core components for look & feel and parent menus
const coreTemplate = require('../../../core/inc/lib-coreTemplate')
const registers = require('../../../core/inc/lib-registers')

/** load and display the register menu & narrative
 * @param {Object} cfg - the register's config.json with reserved properties
 * @param {Object} cfg._logger - the logger
 * @param {Object} cfg._routes - the route names from routes.js
 * @param {Object} cfg._parent - the application configuration 
 */

module.exports = (cfg, router) => {
    const log = cfg._log
    
    //respond only to GET
    router.get(cfg._absRoute, async (ctx, next) => {
        //create the data structure for the home page
        const staticPath = cfg._parent.home.path.static
        const pluginPath = path.join(cfg._parent.registersFolderPath, cfg.folder.pluginPath)
        const serverPath = path.join(pluginPath, cfg.folder.serverPath)
        const processPath = path.join(pluginPath, cfg.folder.processPath)

        const narrativeMdPath = path.join(processPath, cfg.smpteProcess.narrative.current)
        const narrativeMdPathCandidate = path.join(processPath, cfg.smpteProcess.narrative.candidate)
        const narrativeMdPathPrevious = path.join(processPath, cfg.smpteProcess.narrative.previous)

        // load the default template and homepage narrative
        const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativeMdPath)
        const templateHTML = coreTemplate.loadTemplateHTML()

        let viewData = coreTemplate.createTemplateData({
            registerConfig: cfg._parent.home,
            registerSecondaryMenu: menu.html(cfg),
            pageNarrativeHTML: narrativeHTML,
            templateHTML: templateHTML,
            menuForThisRegister: `<div class="ui active item">${cfg.menu}</div>`
        })

        const rendering = coreTemplate.renderPageData(viewData)
        ctx.body = rendering.body
        ctx.status = rendering.status

        if (rendering.status < 300) {
            log.info(`${rendering.status} route:${cfg._absRoutee}`)
        } else {
            log.error(`${rendering.status} route:${cfg._absRoute}`)
        }
    })

}