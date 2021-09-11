/** @module lib-body
 * prepare the text body of the message
 */
const fs = require('fs')
const path = require('path')
config = require('../cfg-va-che/cfg-va-che.js')
const mustache = require('mustache')
const marked = require('marked')
const log = require('pino')(config.get('logging'))

const files = require('../inc/lib-files')
const tabs = require('../inc/lib-tabs')

const thisRoute = `/`

let status = 200

let template
let template_file_path = path.join(config.get('home.path.static'), config.get('home.path.template'))
try {
    template = fs.readFileSync(template_file_path, 'utf-8')
} catch (err) {
    log.error(`route:${thisRoute}  cannot read template file ${template_file_path}`)
    template = "Internal error: unable to load page"
    status = 500
}

let narrative
let narrative_file_path = path.join(config.get('home.path.static'), config.get('home.path.narrative'))
try {
    narrative = fs.readFileSync(narrative_file_path, 'utf-8')
    narrative = marked(narrative)
} catch (err) {
    log.error(`route:${thisRoute}  cannot read narrative file ${narrative_file_path}`)
    narrative = "Internal error: unable to load page"
    status = 500
}

/** return the properties to construct the view for this register / view
 * @param {Object} register - the register to be displayed
 * @param {Object} register.config - object parsed from the register's config.json
 * @param {String} register.narrative_md - relative path to the narrative markdown for the body
 */
module.exports.get_view_data = (register) => {
    return {
        app_title: config.get('app_title'),
        app_description: config.get('app_description'),
        version: config.get('version'),
        prefix: config.get('urlPrefix'),
        files: files.html,
        tabs: tabs.html,
        gtm_id: process.env.hasOwnProperty('GTM_ID') ? process.env.GTM_ID : null,
        rendered_output: "",
        narrative: narrative,
        template: template,
    }
}

module.exports.body = function (data) {
    return { status: status, body: mustache.render(data.template, data) }
}
