/** @module sample-register */
/**Entry point for the sample register
 * 
 * The entry point establishes routes that allows custom
 * views, menus and other services to be displayed.
 * 
 * The sample-register contains a single example of each
 * framework call.
 */

/** export the routes for this register
 * the routes are used in koa's app.use(register.routes) function
 */

const Router = require('koa-router')
const router = new Router();
let cfg

const registerJson = require(`../smpte-process/sample-register.json`)
const registerSchema = require(`../smpte-process/sample-schema.json`)

/** initialise the plugin with its config
 * @param {Object} registerConfigObject - the register's config.json as an object
 */
module.exports.init = (registerConfigObject) => {
    cfg = registerConfigObject

    /** construct all the route names for this register & add to cfg */
    cfg._routes= require('./routes')
    cfg._routes.init(cfg)

    /** initialise the routes that this plugin respondes to */
    require('./route-home')(cfg, router)
}

module.exports.router = router