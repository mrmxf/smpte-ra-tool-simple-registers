/** @module route-view-xml
 *  return index page
 *
 * load index.template and use mustache to update
 * with the xml view
 *
*/
const Router = require('koa-router')
const router = new Router();
config = require('./cfg-va-che/cfg-va-che.js')
const log = require('pino')(config.get('logging'))
const Prism = require('prismjs')

const lmt_body = require('./lib-body')
const lmt = require('./lib-lmt-xml')

const route_uri = `/view-schema`
router.get(`${route_uri}`, (ctx, next) => {

    //get the basic data for the page
    let view_data = lmt_body.view_data

    //get the raw lmt data or false
    let xml = lmt.schema()
    if (!xml) {
        ctx.status = 500
        log.error(`${ctx.status} route:${route_uri}`)
        return
    }

    //format the HTML with left and right gutters
    view_data.rendered_output =
        config.get('static.html.centered_start') + "\n" +
        config.get('static.html.left_gutter') + "\n" +
        config.get('static.html.center_div') +
        '<pre>' + Prism.highlight(xml, Prism.languages.xml, 'xml') + '</pre>\n' +
        config.get('static.html.centered_end') + "\n" +
        config.get('static.html.right_gutter') + "\n"

    //now we have the data, do the rendering
    let rendering = lmt_body.body(view_data)
    ctx.body = rendering.body
    ctx.status = rendering.status

    if (ctx.status < 300) {
        log.info(`${ctx.status} route:${route_uri}`)
    } else {
        log.error(`${ctx.status} route:${route_uri}`)
    }
});

module.exports = router