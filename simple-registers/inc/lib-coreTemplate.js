/** @module lib-body
 * prepare the text body of the message
 */
const fs = require('fs')
const path = require('path')
config = require('../cfg-va-che/cfg-va-che.js')
const mustache = require('mustache')
const mdit = require('markdown-it')()
const log = require('pino')(config.get('logging'))

const files = require('./lib-files')
const tabs = require('./lib-tabs')
const { register } = require('../route/route-metadata.js')
const { config } = require('dotenv')

const thisRoute = `/`

let status = 200

let defaultTemplateFilePath = path.join(config.get('home.path.static'), config.get('home.path.template'))
let defaultNarrativeFilePath = path.join(config.get('home.path.static'), config.get('home.path.narrative'))

module.exports.loadTemplateHTML = (templateFilePath) => {
    let templateHTML
    const filePath= (templateFilePath) ? templateFilePath : defaultTemplateFilePath
    try {
        templateHTML = fs.readFileSync(filePath, 'utf-8')
    } catch (err) {
        log.error(`route:${thisRoute}  cannot read template file ${filePath}`)
        templateHTML = "Internal error: unable to load page template"
        status = 500
    }
    }

module.exports.loadNarrativeMD = (narrativeFilePath) => {
    let narrativeMD
    const filePath= (narrativeFilePath) ? narrativeFilePath : defaultNarrativeFilePath
    try {
        narrativeMD = fs.readFileSync(filePath, 'utf-8')
        narrativeMD = mdit.render(narrativeMD)
    } catch (err) {
        log.error(`route:${thisRoute}  cannot read narrative file ${filePath}`)
        narrativeMD = "Internal error: unable to load page"
        status = 500
    }
}

/** return the properties to construct the view for this register / view
 * @param {Object} register - the register to be displayed
 * @param {Object} register.config - object parsed from the register's config.json
 * @param {String} register.narrative_md - relative path to the narrative markdown for the body
 */
module.exports.createTemplateData = (registerData, narrativeMd, customTemplate) => {
    let gtm_id
    try {
        gtm_id = config.get('gtm_id')
    } catch (err) {
        gtm_id = null
    }
    return {
        serverName: config.get('serverName'),
        pageTitle: registerData.title,
        pageDescription: registerData.description,
        version: registerData.version,
        urlPrefix: registerData.urlPrefix,
        files: files.html,
        tabs: tabs.html,
        gtm_id: gtm_id,
        renderedOutput: "",
        narrativeM: narrativeMd,
        templateHTML: customTemplate,
    }
}

module.exports.renderPageData = function (data) {
    return { status: status, body: mustache.render(data.template, data) }
}
