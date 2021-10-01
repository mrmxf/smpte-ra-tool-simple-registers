/** @module registers */
/** create a static list of registers:
 *    - <folder>/config.json must exist
 *    - <folder>/<serverPath>/index.js must exist
 *    - cfg.isEnabled must be true
 * 
 * @returns {Object} registers
 * @returns {Object} registers.<key> - key is the folder name
 * @returns {String} registers.<key>.configPath - path to config.json (relatie to project)
 * @returns {String} registers.<key>.entryPoint - path to index.js (relatie to project)
 * @returns {String} registers.<key>.cfg - register's config.json as an object
 * @returns {String} registers.<key>.cfg._parent - global config as a static object
 * @returns {String} registers.<key>.plugin - module.exports from index.js
 * @returns {String} registers.<key>._absRoute - absolute route to register
 */

const fs = require('fs')
const path = require('path')

const config = require('../cfg-va-che/cfg-va-che')
const log = require('pino')(config.get('logging'))

const registersFolderPath = config.get('registersFolderPath')
let registerPluginFolders = []
const registers = {}

//helper to do path compensation for the require() function
const tweakPath = p => path.join('..', '..', p)

try {
    registerPluginFolders = fs.readdirSync(registersFolderPath)
} catch (err) {
    log.error(`registers folde ${registersFolderPath} cannot be read - no plugins to load`)
    log.debug(err)
}

registerPluginFolders.forEach(r => {
    let register = {}
    //check that there is a config.json & skip if not present
    try {
        register.configPath = path.join(registersFolderPath, r, 'config.json')
        //compensate path for the fact we're in the inc folder
        register.cfg = require(tweakPath(register.configPath))
    } catch (err) {
        log.error(`plugin file ${register.configPath} cannot be loaded - no plugin to load`)
        log.debug(err)
        return
    }

    //do nothing if not enabled
    if (!register.cfg.isEnabled) return

    //check there is an index.js to load
    try {
        register.entryPoint = path.join(registersFolderPath, r, register.cfg.folder.serverPath, 'index.js')
        register.plugin = require(tweakPath(register.entryPoint))
    } catch (err) {
        log.error(`plugin file ${register.entryPoint} cannot be loaded - no plugin to load`)
        log.debug(err)
        return
    }

    //check the entry method & router exist
    if (!register.plugin.init) {
        log.error(`plugin file ${register.entryPoint} does not a method init() - no plugin to load`)
        return
    }
    if (!register.plugin.router && !register.plugin.router.routes) {
        log.error(`plugin file ${register.entryPoint} does not a method router.init() - no plugin to load`)
        return
    }

    register.cfg._parent = config.get("")

    //construct the absolute route
    let absRoute = config.get("urlPrefix")
    absRoute += (absRoute.endsWith('/')) ? "" : '/'

    absRoute += config.get("registersPrefix")
    absRoute += (absRoute.endsWith('/')) ? "" : '/'

    absRoute += register.cfg.urlPrefix
    absRoute += (absRoute.endsWith('/')) ? "" : '/'
    
    register.cfg._absRoute = absRoute

    //configure logger
    register.cfg._log = log

    //add this register to the list
    registers[r] = register
})

module.exports = registers