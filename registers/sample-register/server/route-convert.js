/** @module route-convert */
/**
 * A route to view the validation of the JSON against the schema
 *
 * route: <mount-point>/convert
 */
const path = require('path')

//helpers for this register
const menu = require('./menu')

//core components for look & feel and parent menus
const cvt = require('../../../core/register-helpers/convert-helper')

module.exports = (cfg, router) => {

    // GET convert homepage
    router.get(cfg._routes.convert, async (ctx, next) => {
        const log = cfg._log
        const processPath = path.join(cfg._folderPath, cfg.folder.processPath)
        const narrativeMdPath = path.join(processPath, cfg.smpteProcess.narrative.current)

        //get the json path
        let filename = cfg.smpteProcess.register.current
        let jsonPath = path.join(cfg._folderPath, cfg.folder.processPath, filename)

        //get the schema path
        filename = cfg.smpteProcess.schema.current
        schemaPath = path.join(cfg._folderPath, cfg.folder.processPath, filename)

        const cvtList = cvt.loadConvertFromFolder(cfg)
        const res = cvt.renderPage(ctx, cfg, menu, jsonPath, schemaPath, narrativeMdPath, cvtList)

        ctx.status = res.status
        ctx.body = res.body

        if (res.status < 300) {
            log.info(`${res.status} route:${cfg._routes.convert}`)
        } else {
            log.error(`${res.status} route:${cfg._routes.convert}`)
        }
    })

    //POST a conversion request
    router.post(cfg._routes.convert, async (ctx, next) => {
        //do the standard conversion
        // ctx.request.body = {conversion: "someID", string: "xml-stuff"}
        cvt.doConversion(cfg, ctx)
            .then(() => next())
    })
}