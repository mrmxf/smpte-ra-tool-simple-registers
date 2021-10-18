/** @module convert-helper */
/**
 * A helper that manages a bunch of conversion tools and displays
 * a page with a common look and feel. Some of the code is browser
 * side (using fomantic and a custom drag/drop helper)
 * Most of the code is server side.
 *
 * Documentation is before each function. Flow is typically
 *
 * ```javascript
 *   const cvt = require("path/to/convert-helper")
 *   cfg.convert = cvt.loadConvertFromFolder("path/to/folder")
 *   cfg.renderPage(cfg, menu, jsonPath, schemaPath, narrativeMdPath)
 * ```
 */
const fs = require('fs')
const path = require('path')

//helpers for this register
const convertWorker = require('./covnert-worker')
const validateWorker = require('./validate-json-worker')

//core components for look & feel and parent menus
const coreTemplate = require('../inc/lib-coreTemplate')

/**
 *
 * @param {String} folderPath path for the app to read the folder contents
 */
module.exports.loadConvertFromFolder = (cfg) => {
    const folderPath = path.join(cfg._folderPath, cfg.folder.serverPath, cfg.folder.converterPath)

    let cvtFiles = []

    try {
        cvtFiles = fs.readdirSync(folderPath, { withFileTypes: true })
    } catch (err) {
        log.error(`convertert for folder ${folderPath} cannot be read - no converters to load`)
        log.debug(err)
        return []
    }

    //iterate to find all the json files
    cvtFiles.forEach(f => {
        if (!f.isFile()) return
        if (f.name.substr(-5) !== ".json") return

        //load the json into a convertor object (relative to the register-helpers folder)
        let filePath = path.join("..", "..", folderPath, f.name)
        let converter = require(filePath)
        let workerPath = filePath.substr(0, filePath.length-4) + "js"
        converter.worker = require(workerPath)

        //check the entry method & router exist
        if (!converter.worker.toSmpte) {
            log.error(`plugin file ${workerPath} does not have a method toSMPTE() - no covnerter to load`)
            return
        }
        if (!converter.worker.fromSmpte) {
            log.error(`plugin file ${workerPath} does not have a method fromSmpte() - no covnerter to load`)
            return
        }

        //add to the list
        cvtList.push(converter)
    })
}

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
module.exports.renderPage = (cfg, menu, jsonPath, schemaPath, narrativeMdPath, cvtList) => {
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