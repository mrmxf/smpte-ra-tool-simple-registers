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
const convertUi = require('./convert-helper-ui')
const convertWorker = require('./convert-worker')
const validateWorker = require('./validate-json-worker')

//core components for look & feel and parent menus
const coreTemplate = require('../inc/lib-coreTemplate')

/**
 *
 * @param {String} folderPath path for the app to read the folder contents
 */
const loadConvertFromFolder = (cfg) => {
    const folderPath = path.join(cfg._folderPath, cfg.folder.serverPath, cfg.folder.converterPath)

    let cvtFiles = []
    let cvtList = [

    ]
    try {
        cvtFiles = fs.readdirSync(folderPath, { withFileTypes: true })
    } catch (err) {
        log.error(`convertert for folder ${folderPath} cannot be read - no converters to load`)
        log.debug(err)
        return cvtList
    }

    //iterate to find all the json files
    cvtFiles.forEach(f => {
        if (!f.isFile()) return
        if (f.name.substr(-5) !== ".json") return

        //load the json into a convertor object (relative to the register-helpers folder)
        let filePath = path.join("..", "..", folderPath, f.name)
        let converter = require(filePath)
        let workerPath = filePath.substr(0, filePath.length - 4) + "js"
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
    return cvtList
}
module.exports.loadConvertFromFolder = loadConvertFromFolder

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
module.exports.renderPage = (ctx, cfg, menu, jsonPath, schemaPath, narrativeMdPath, cvtList) => {
    const log = cfg._log
    const res = {
        status: 200,
        body: ""
    }

    let json, schema

    //get the data
    try {
        json = fs.readFileSync(jsonPath, 'utf8')
    } catch (err) {
        res.status = 500
        log.error(`${res.status} route:${cfg._routes.register}`)
        log.debug(err)
        return
    }

    //get the schema
    try {
        schema = fs.readFileSync(schemaPath)
    } catch (err) {
        res.status = 500
        log.error(`${res.status} route:${cfg._routes.register}`)
        log.debug(err)
    }

    // //validate the data
    // let response = worker.validate(json, schema)
    let response = {
        status: 200,
        HTML: "Upload your source content and Select a conversion"
    }

    //prepare the UI view based on the results of the conversion
    let segmentColor = "green"
    let extraMenu = `<span class="item active" "><i class="play ${cfg.homeIconClass} icon"></i>${cfg.routes.convert}</span>`
    let uiView = `<div class ="ui ${segmentColor} segment">
    ${convertUi.html(cfg, cvtList)}
    </div>`

    // load the default template and homepage narrative
    const narrativeHTML = coreTemplate.loadNarrativeHTML(narrativeMdPath)
    const templateHTML = coreTemplate.loadTemplateHTML()

    let viewData = coreTemplate.createTemplateData({
        ctx: ctx,
        cfg: cfg,
        registerSecondaryMenu: menu.html(cfg, cfg._routes.validate, extraMenu),
        pageNarrativeHTML: narrativeHTML,
        templateHTML: templateHTML,
        menuForThisRegister: `<div class="ui active item">${cfg.menu}</div>`,
        uiView: uiView,
        dataView: `<div id="dataView"></div>`
    })

    const rendering = coreTemplate.renderPageData(viewData)
    res.body = rendering.body
    res.status = rendering.status

    if (rendering.status < 300) {
        log.info(`${rendering.status} route:${cfg._routes.validate}`)
    } else {
        log.error(`${rendering.status} route:${cfg._routes.validate}`)
    }
    return res
}

/** reject any errors in the post object
 *
 * @param {Object*} cfg the register's configuration object
 * @param {Object} ctx the koa contect
 * @returns {boolean} false if ctx.status & ctx.body are set to return an error
 */
const conversionParmsOk = (cfg, ctx, cvtList) => {
    //check that the post request has the required parameters
    if (!ctx.request.body || !ctx.request.body.conversion || !ctx.request.body.sourceText) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - required property missing from request`
        return false
    }

    //check that the conversion is in this register
    let conversionId = (ctx.request.body && ctx.request.body.conversion) ? ctx.request.body.conversion : "undefined"
    let foundInThisRegister = false
    cvtList.forEach(cvt => {
        foundInThisRegister |= (conversionId === cvt.toSmpteId) || (conversionId === cvt.fromSmpteId)
    })
    if (!ctx.request.body || !ctx.request.body.conversion || !ctx.request.body.sourceText) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - conversion id <strong><em>${conversionId}</em></strong> does not exist`
        return false
    }

    return true
}

/** execute the conversion for this register
 *
 * @param {Object*} cfg the register's configuration object
 * @param {Object} ctx the koa contect
 */
module.exports.doConversion = async (cfg, ctx) => {
    let cvtList = loadConvertFromFolder(cfg)
    if (!conversionParmsOk(cfg, ctx, cvtList))
        return

    let conversionId = ctx.request.body.conversion
    // we know that there was a match and that the worker
    // should be able to do the job or return an error in res
    // so execute the conversion
    let res
    cvtList.forEach(cvt => {
        if (conversionId === cvt.toSmpteId)
            res = cvt.worker.toSmpte(ctx.request.body.sourceText)
        if (conversionId === cvt.fromSmpteId)
            res = cvt.worker.fromSmpte(ctx.request.body.sourceText)
    })
    ctx.status = res.status
    ctx.body = res.body
}