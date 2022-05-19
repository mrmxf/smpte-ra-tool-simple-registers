/** @module utils */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

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
 * attach the string to ctx.smr.pageJavascript
 */
const fs = require('fs')
const path = require('path')

const { register } = require(__smregisters + '/sample-register/server/routes')
const config = require(__smr + '/cfg-va-che.js')
const DEBUG = config.get("DEBUG")
const log = require('pino')(config.get('logging'))

module.exports = async (ctx, next) => {
    const registers = require('../lib-registers')
    let jsString = "/* hello mum*/"

    let url = ctx.request.url.split('/')

    //register paths are /urlPrefix/register/registerName/convert to length >2

    //check for and remove zero length "/""
    if (url[0].length == 0)
        url.shift()

    //check for and remove urlPrefix
    if (`/${url[0]}/` == config.get("urlPrefix"))
        url.shift()

    //exit if the remaining route is not /register/registerName/thingy
    if (url.length < 2) {
        next()
        return
    }

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
            let thisUrl = ctx.request.url

            // match the key of the route configuration object to get the
            // autoloadRouteFilename if it exists
            let thisRoute
            for (let r in register.cfg.routes) {
                if (register.cfg.routes[r].absRoute == thisUrl) {
                    thisRoute = r
                    break
                }
            }

            // try and load the main autoload javascript
            let autoloadFilename = `autoload.js`
            let absPath = path.join(register.cfg._folderPath, register.cfg.folder.browserPath, autoloadFilename)
            let mainJs, routeJs
            try {
                mainJs = fs.readFileSync(absPath)
            } catch (error) {
                mainJs = ""
            }

            // try and load the route autoload javascript
            // try and load the main autoload javascript
            if (thisRoute) {
                autoloadFilename = `autoload-${thisRoute}.js`
                absPath = path.join(register.cfg._folderPath, register.cfg.folder.browserPath, autoloadFilename)
                try {
                    routeJs = fs.readFileSync(absPath)
                } catch (error) {
                    routeJs = ""
                }
            }
            //emit the javascript if any was loaded
            if (mainJs || routeJs) {
                ctx.smr.pageJavascript = `<script>\n${mainJs}\n${routeJs}\n</script>`
            }
            else {
                ctx.smr.pageJavascript = ""
            }
        }
    }
    next()
}
