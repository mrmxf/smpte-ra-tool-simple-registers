/** @module lib-body
 * prepare the text body of the message
 */
const fs = require('fs')
const path = require('path')
const config = require('../cfg-va-che/cfg-va-che')
const mustache = require('mustache')
const mdit = require('markdown-it')()
const log = require('pino')(config.get('logging'))
const menus = require("../inc/lib-menu")


const thisRoute = `/`

let status = 200

let defaultTemplateFilePath = path.join(config.get('home.path.static'), config.get('home.path.template'))
let defaultNarrativeFilePath = path.join(config.get('home.path.static'), config.get('home.path.narrative'))

let recentTemplateHTML = ""
let loadNarrativeHTML = ""

module.exports.loadTemplateHTML = (templateFilePath) => {
    const filePath = (templateFilePath) ? templateFilePath : defaultTemplateFilePath
    try {
        recentTemplateHTML = fs.readFileSync(filePath, 'utf-8')
        status = 200
    } catch (err) {
        log.error(`route:${thisRoute}  cannot read template file ${filePath}`)
        recentTemplateHTML = "Internal error: unable to load page template"
        status = 500
    }
    return recentTemplateHTML
}

module.exports.loadNarrativeHTML = (narrativeFilePath) => {
    const filePath = (narrativeFilePath) ? narrativeFilePath : defaultNarrativeFilePath
    try {
        loadNarrativeHTML = fs.readFileSync(filePath, 'utf-8')
        status = 200
    } catch (err) {
        log.error(`route:${thisRoute}  cannot read narrative file ${filePath}`)
        loadNarrativeHTML = "Internal error: unable to load page"
        status = 500
    }
    try {
        loadNarrativeHTML = mdit.render(loadNarrativeHTML)
        status = 200
    } catch (err) {
        log.error(`route:${thisRoute}  cannot read narrative file ${filePath}`)
        loadNarrativeHTML = "Internal error: unable to load page"
        status = 500
    }
    return loadNarrativeHTML
}

/** return the properties to construct the view for this register / view
 * @param {Object} options - the register to be displayed
 * @param {Object} options.config - object parsed from the register's config.json
 * @param {String} register.menuForThisRegister - menuHTML to be shown for this register
 * @param {String} register.narrativeHTML - narrativeHTML the narrative HTML that
 * @param {String} register.customTemplateHTML - customTemplateHTML the template HTML for this registr
 */
module.exports.createTemplateData = (options) => {
    let googleTagManagerId, homeData
    try {
        googleTagManagerId = config.get('googleTagManagerId')
        homeData = config.get(`home`)
    } catch (err) {
        googleTagManagerId = null
    }
    return {
        //metadata elements
        serverName: config.get('serverName'),
        appTitle: homeData.appTitle,
        appDescription: homeData.appDescription,
        version: homeData.version,
        urlPrefix: homeData.urlPrefix,
        googleTagManagerId: googleTagManagerId,
        //menu barelements
        menuForListOfRegisters: menus.getListOfRegistersMenu(options),
        menuForThisRegister: (options.menuForThisRegister) ? options.menuForThisRegister : "",
        //open & close the wrapper around the page view
        wrapperOpen: (options.wrapperOpen) ? options.wrapperOpen : "",
        wrapperClose: (options.wrapperClose) ? options.wrapperClose : "",
        //messages and secondary menu on the template page
        notificationMessages: (options.notificationMessages) ? options.notificationMessages : "",
        registerSecondaryMenu: (options.registerSecondaryMenu) ? options.registerSecondaryMenu : "",
        //rendering on the default template page
        pageNarrativeHTML: (options.pageNarrativeHTML) ? options.pageNarrativeHTML : loadNarrativeHTML,
        uiView: (options.uiView) ? options.uiView : "",
        // anything to be shown outside the page wrapper (i.e. super wide or unformatted data)
        dataView: (options.dataView) ? options.dataView : "",
        //data to be passed between rendering stages
        templateHTML: (options.customTemplateHTML) ? options.customTemplateHTML : recentTemplateHTML,
        renderedOutput: (options.renderedOutput) ? options.renderedOutput : "",
    }
}

module.exports.renderPageData = function (data) {
    let finalHTML = mustache.render(data.templateHTML, data)
    return {
        status: status,
        body: finalHTML
    }
}