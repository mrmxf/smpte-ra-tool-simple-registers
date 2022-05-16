/** @module route-validate */
/**
 * A route to view the validation of the JSON against the schema
 *
 * route: <mount-point>/validate
 */
const path = require('path')

//helpers for this register
const menu = require('./menu')

//core components for look & feel and parent menus
const jsonValidateHelper = require('../../../core/utils/validate-helper-json')

module.exports = (cfg, router) => {
    const log = cfg._log

    // GET homepage
    router.get(cfg._routes.validate, async (ctx, next) => {
        const processPath = path.join(cfg._folderPath, cfg.folder.processPath)
        const narrativeMdPath = path.join(processPath, cfg.smpteProcess.narrative.current)

        //get the json path
        let filename = cfg.smpteProcess.register.current
        let jsonPath = path.join(cfg._folderPath, cfg.folder.processPath, filename)

        //get the schema path
        filename = cfg.smpteProcess.schema.current
        schemaPath = path.join(cfg._folderPath, cfg.folder.processPath, filename)

        const res = jsonValidateHelper(ctx, cfg, menu, jsonPath, schemaPath, narrativeMdPath)

        ctx.status = res.status
        ctx.body = res.body

        if (res.status < 300) {
            log.info(`${res.status} route:${cfg._routes.validate}`)
        } else {
            log.error(`${res.status} route:${cfg._routes.validate}`)
        }
    })

}