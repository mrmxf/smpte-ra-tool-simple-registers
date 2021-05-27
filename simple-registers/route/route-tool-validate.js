/** @module route-tool-validate
 *  return index page
 *
 * load index.template and use mustache to update
 * with the xml view
 *
*/
const Router = require('koa-router')
const router = new Router();
config = require('./inc/config-process')
const mustache = require('mustache')
const log = require('pino')(config.get('logging'))
const esc = require('escape-html')

const lmthelp = require('./lib-lmt-helper')
const lmt_body = require('./lib-body')
const lmt = require('./lib-lmt-xml')

//const libxml = require('libxmljs')
const libxml = require('libxmljs2')

const mtemplate = lmthelp.mustache_template

/** validate xml against xsd
 * @param {String} xml - document as a string
 * @param {String} xsd - document as a string
 */
async function validate(xml, xsd) {
    let xml_doc = libxml.parseXmlString(xml)
    let xsd_doc = libxml.parseXmlString(xsd)

    let xml_valid=  xml_doc.validate(xsd_doc)
    if (xml_valid)
        return true
    else
        return xml_doc.validationErrors
}


const route_uri = `/tool-validate`
router.get(`${route_uri}`, async (ctx, next) => {

    //get the basic data for the page
    let view_data = lmt_body.view_data

    //get the raw lmt data or false
    let xml = lmt.xml()
    if (!xml) {
        ctx.status = 500
        log.error(`${ctx.status} (xml) route:${route_uri}`)
        return
    }

    //get the raw lmt schema or false
    let xsd = lmt.schema()
    if (!xml) {
        ctx.status = 500
        log.error(`${ctx.status} (schema) route:${route_uri}`)
        return
    }

    //create a full width table of values (no gutters)
    let validation  = await validate(xml, xsd)

    let validation_response

    if (validation === true){
        validation_response = mustache.render(lmthelp.mustache_template.validation.success, {alert:"Success - XML validates"})
    }else{
        //this mustache render leaves the <div> open for error messages
        validation_response = mustache.render(lmthelp.mustache_template.validation.error, {alert:"Fail - XML did not validate"})
        validation_response += '<ul>'
        // now append a list for each error
        validation.forEach( error => {
            validation_response += mustache.render(lmthelp.mustache_template.validation.error_message, error )
        })
        //now close the list and the div
        validation_response += '</ul></div>'
    }

    view_data.rendered_output =
        config.get('static.html.full_width_start') + "\n" +
        validation_response +
        config.get('static.html.full_width_end') + '\n'

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