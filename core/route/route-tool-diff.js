/** @module route-tool-diff
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
const esc = require('escape-html')
const xmlh = require('./lib-lmt-helper')
const lmt = require('./lib-lmt-xml')
const Prism = require('prismjs')

const lmt_body = require('./lib-body')
const lmt_2_col_diff = require('./lib-diff-2-col')

/** sort 2 terms of the LMT term array
 * return -ve number if out of order
 * @param {term} t1 term nearest beginning or array
 * @param {term} t2 term nearest end of array
 */
function sort_terms(t1, t2) {
    let a = parseInt(t1.termID[0])
    let b = parseInt(t2.termID[0])
    if (a < b) return 1
    if (a > b) return -1
    return 0
}

const route_uri = `/tool-diff`
router.get(`${route_uri}`, async (ctx, next) => {

    //get the raw lmt data or false
    let xml = lmt.xml()
    if (!xml) {
        ctx.status = 500
        log.error(`${ctx.status} route:${route_uri}`)
        return
    }
    let lmtjs = await xmlh.get_xml_as_JSON(xml)
    lmtjs["Synaptica-ZThes"].term.sort(sort_terms)

    //get the raw lmt data or false
    let xmlref = lmt.xml_ref()
    if (!xmlref) {
        ctx.status = 500
        log.error(`${ctx.status} route:${route_uri}`)
        return
    }
    let refjs = await xmlh.get_xml_as_JSON(xmlref)
    // refjs.Zthes.term.sort(sort_terms)

    // //get the difference view using a custom function for this register
    // let view_HTML = lmt_2_col_diff(lmtjs, refjs)

    let view_HTML="<h3>diff is still work in progress</h3>"
    //get the basic data for the page
    let view_data = lmt_body.view_data

    //format the HTML with left and right gutters
    view_data.rendered_output =
    config.get('static.html.centered_start') + "\n" +
    config.get('static.html.left_gutter') + "\n" +
    config.get('static.html.center_div') +
    view_HTML +
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