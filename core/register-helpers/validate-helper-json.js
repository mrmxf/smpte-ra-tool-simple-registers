/** @module validate-helper-json */
/**
 * A helper that takes a path to a file and schema and returns some HTML:
 *
 * case #1 success
 *   A nice message
 *
 * case #2 validation errors
 *   A list of those errors
 *
 * case #3 missing files and other system errors
 *   An error code  and some extra errors
 */
const fs = require('fs')

//helpers for this register
const worker = require('./validate-json-worker')

//core components for look & feel and parent menus
const coreTemplate = require('../inc/lib-coreTemplate')

/**
 *
 * @param {Object} cfg the plugins config object
 * @param {Object} menu the menu Object exported for this register
 * @param {String} jsonPath the file path to the jsonFile
 * @param {String} schemaPath the file path to the schemaFile
 * @param {String} narrativeMdPath the file Narrative for this register
 * @return {Object} ctx is the proposed set of values for the koa context object
 * @return {String} ctx.status is the HTTTP error code (proposed)
 * @return {String} ctx.body is the body HTML (proposed)
 *
 */
module.exports = (cfg, menu, jsonPath, schemaPath, narrativeMdPath) => {
    const log = cfg._log
    const ctx = {
        status: 200,
        body: ""
    }

    let json, schema

    //get the schema
    try {
        json = fs.readFileSync(jsonPath, 'utf8')
    } catch (err) {
        ctx.status = 500
        log.error(`${ctx.status} route:${cfg._routes.register}`)
        log.debug(err)
        return
    }

    //get the schema
    try {
        schema = fs.readFileSync(schemaPath)
    } catch (err) {
        ctx.status = 500
        log.error(`${ctx.status} route:${cfg._routes.register}`)
        log.debug(err)
    }

    //validate the data
    let response = worker.validate(json, schema)

    //prepare the UI view
    let segmentColor = (response.ok) ? "green" : "red"
    let uiView = `<div class ="ui ${segmentColor} segment">${response.HTML}</div>`

    // load the default template and homepage narrative
    const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativeMdPath)
    const templateHTML = coreTemplate.loadTemplateHTML()

    let viewData = coreTemplate.createTemplateData({
        cfg: cfg,
        registerSecondaryMenu: menu.html(cfg, cfg._routes.validate),
        pageNarrativeHTML: narrativeHTML,
        templateHTML: templateHTML,
        menuForThisRegister: `<div class="ui active item">${cfg.menu}</div>`,
        uiView: uiView
    })

    const rendering = coreTemplate.renderPageData(viewData)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${cfg._routes.validate}`)
    } else {
        log.error(`${rendering.status} route:${cfg._routes.validate}`)
    }
    return ctx
}