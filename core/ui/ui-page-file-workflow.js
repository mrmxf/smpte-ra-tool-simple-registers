/** @module ui-page */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Module to process files in 3 stages
 * 
 * @param {Object} ctx The koa context object
 * @param {Object} cfg The SMR configuration object
 * @param {Object} menu The register menu object
 * @param {Object} opt Data to render the page
 * @param {String} opt.pageTitle Title for page & tab
 * @param {String} opt.pageHelp Text that appears near the title
 * @param {String} opt.route A route from the config file e.g. cfg.routes.convert
 */

//core components for look & feel and parent menus
const coreTemplate = require(__smr + '/lib-coreTemplate')

// groups for this page
const titleGroup = require(`./ui-group-title`)

module.exports.renderPage = (ctx, cfg, menu, opt) => {
    const log = cfg._log
    // prepare the secondary menu
    let menu2Html = menu.html(cfg, ctx.request.originalUrl, opt.breadCrumbsMenus)
    //assemble the path to the narrative Markdown file
    const narrativePath = path.join(cfg._folderPath, cfg.folder.processPath, cfg.smpteProcess.narrative.current)

    //attempt to load the data for this page (narrative, json etc)
    let uiView = `
       <div class="ui styled accordion">
        ${titleGroup.renderGroup(ctx, cfg, menu, opt)}
        </div>`

    // load the default template and homepage narrative
    const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativePath)
    const templateHTML = coreTemplate.loadTemplateHTML()

    let viewData = coreTemplate.createTemplateData({
        ctx: ctx,
        cfg: cfg,
        registerSecondaryMenu: menu2Html,
        menuTitleForThisPage: `<div class="ui active item">${opt.pageTitle}</div>`,
        pageNarrativeHTML: narrativeHTML,
        templateHTML: templateHTML,
        uiView: uiView,
        dataView: `<div id="dataView"></div>`
    })

    //now render the data into the HTML template
    const res = coreTemplate.renderPageData(viewData)

    const msg = `${res.status} route:${opt.route.display}`
    if (res.status < 300) { log.info(msg) } else { log.error(msg) }

    return res
}
