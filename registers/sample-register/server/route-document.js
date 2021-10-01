/** @module route-register */
/**
 * A route to return the document as a pdf
 *
 * route: <mount-point>/register
 */
const fs = require('fs')
const path = require('path')

module.exports = (cfg, router) => {
    const log = cfg._log

    // GET raw data
    router.get(cfg._routes.document, async (ctx, next) => {
        let filename = cfg.smpteProcess.controlDoc
        let filePath = path.join(cfg._folderPath, cfg.folder.processPath, filename)

        try {
            let pdf = fs.readFileSync(filePath)
            ctx.status = 200
            ctx.set('Content-Type', 'application/pdf')
            //pull the download filename from the config file
            ctx.set(`Content-Disposition`, `attachment;filename=${cfg.smpteProcess.controlDocDownloadName}`);
            ctx.body = pdf
            log.info(`${ctx.status} route:${cfg._routes.register}`)
        } catch (err) {
            ctx.status = 500
            log.error(`${ctx.status} route:${cfg._routes.register}`)
            log.debug(err)
        }
    })

}