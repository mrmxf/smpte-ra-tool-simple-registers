/** @module ui-page */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

//core components for look & feel and parent menus
const coreTemplate = require(__smr + '/lib-coreTemplate')

// groups for this page
const titlePane = require(`./ui-pane-title`)
const sourcePane= require(`./ui-pane-source`)

/** Module to process files in 3 stages
 */ 


/** render a file workflow page
 *  
 * @param                {Object} ctx The koa context object
 * @param                {Object} cfg The SMR configuration object
 * @param               {Object} menu The menu object to render the register's
 *                                    secondary menu
 * @param {uiPageFileWorkflowOpt} opt Data to render the page
 */

module.exports.renderPage = (ctx, cfg, menu, opt) => {
    const log = cfg._log
    // prepare the secondary menu
    let menu2Html = menu.html(cfg, ctx.request.originalUrl, opt.breadCrumbsMenu)
    //assemble the path to the narrative Markdown file
    const narrativePath = path.join(cfg._folderPath, cfg.folder.processPath, cfg.smpteProcess.narrative.current)

    //Create the page: group by group

    //First Pane is the title
    let paneData = titlePane.renderPane(ctx, cfg, opt)
    let paneStatus= paneData.status
    let pageHtml = `<div class="ui fluid blue styled accordion">\n${paneData.body}`

    //Second Pane is the source selector
    // Grab the HTML & remember the worst error
    paneData = sourcePane.renderPane(ctx, cfg, opt.source)
    paneStatus= Math.max(paneData.status, paneStatus)
    pageHtml+= paneData.body

    //terminate the accordian block
    pageHtml+=` </div>`

    // load the default template and homepage narrative
    const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativePath)
    const templateHTML = coreTemplate.loadTemplateHTML()

    let viewData = coreTemplate.createTemplateData({
        ctx: ctx,
        cfg: cfg,
        pageTitle: opt.paneTitle,
        registerSecondaryMenu: menu2Html,
        menuTitleForThisPage: `<div class="ui active item">${cfg.menu}</div>`,
        pageNarrativeHTML: narrativeHTML,
        templateHTML: templateHTML,
        uiView: pageHtml,
        dataView: `<div id="dataView"></div>`
    })

    //now render the data into the HTML template
    const res = coreTemplate.renderPageData(viewData)

    //remember the worst error
    res.status = Math.max(res.status, paneStatus)

    const msg = `${res.status} route:${opt.route.display}`
    if (res.status < 300) { log.info(msg) } else { log.error(msg) }

    return res
}
