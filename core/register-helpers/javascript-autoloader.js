/** @module javascript-autoloader */
/**
 * cascade all the javascript files for this page
 * and embed the as a text string at the bottom of
 * the register page:
 *
 * ```
 * <script language="javascript">
 *   //contents of browser/autoload.js
 *   //contents of browser/autoload-thisRoute.js
 * </script>
 * ```
 * attach the string to ctx.smpte.pageJavascript
 */
const fs = require('fs')
const path = require('path')

const { register } = require('../../registers/sample-register/server/routes')
const config = require('../cfg-va-che/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))

module.exports = async (ctx, next) => {
    const registers = require('../inc/lib-registers')
    let jsString = "/* hello mum*/"

    let url = ctx.request.url.split('/')

    //register paths are /register/registerName/convert to length >2
    if (url.length < 2) {
        next()
        return
    }

    //check for and remove zero length "/""
    if (url[0].length == 0)
        url.shift()

    // if this url starts with the registers prefix then discard
    // the prefix so that we can find the right register
    // otherwise just carry on with the next middleware
    if (url[0] == config.get("registersPrefix")) {
        url.shift()

        //locate the first matching register with this path
        let register
        for (let r in registers) {
            //is this the right register?
            if (url[0] === registers[r].cfg.urlPrefix) {
                register = registers[r]
                break
            }
        }
        //only try to load javascript if this route is a register
        if (register) {
            for (let r in register.cfg.routes) {
                if (url[1].length==0) {
                    //the home page for this register
                    let autoloadFilename = `autoload.js`
                    let autoloadRouteFilename = `autoload-home.js`
                    let absPath = path.join(register.cfg._folderPath, register.cfg.folder.browserPath)
                    let mainJs, routeJs
                    try {
                        mainJs = fs.readFileSync(path.join(absPath, autoloadFilename))
                    } catch (error) {
                        mainJs = ""
                    }
                    try {
                        routeJs = fs.readFileSync(path.join(absPath, autoloadRouteFilename))
                    } catch (error) {
                        routeJs = ""
                    }
                    if (mainJs || routeJs){

                        ctx.smpte.pageJavascript = `<script>\n${mainJs}\n${routeJs}\n</script>`
                    }
                    else{
                        ctx.smpte.pageJavascript = ""
                    }
                }
                if (url[1] === register.cfg.routes[r]) {
                    let autoloadFilename = `autoload.js`
                    let autoloadRouteFilename = `autoload-${url[1]}.js`
                    let absPath = path.join(register.cfg._folderPath, register.cfg.folder.browserPath)
                    let mainJs, routeJs
                    try {
                        mainJs = fs.readFileSync(path.join(absPath, autoloadFilename))
                    } catch (error) {
                        mainJs = ""
                    }
                    try {
                        routeJs = fs.readFileSync(path.join(absPath, autoloadRouteFilename))
                    } catch (error) {
                        routeJs = ""
                    }
                    if (mainJs || routeJs){

                        ctx.smpte.pageJavascript = `<script>\n${mainJs}\n${routeJs}\n</script>`
                    }
                    else{
                        ctx.smpte.pageJavascript = ""
                    }
                }
            }

        }
    }
    next()
}
