/** @module route-table-lang
 *  return index page
 *
 * load index.template and use mustache to update
 * with the xml view
 *
*/
const Router = require('koa-router')
const router = new Router();
config = require('./cfg-va-che/cfg-va-che.js')
const mustache = require('mustache')
const log = require('pino')(config.get('logging'))

const xmlh = require('./lib-lmt-helper')
const lmt_body = require('./lib-body')
const lmt = require('./lib-lmt-xml')

const mtemplate = xmlh.mustache_template

/** make the language table */
async function make_lang_table(xml) {
    let heading_data = {
        heading: [
            'term Id',
            'term Name',
            'Language<br>Group<br>Tag',
            `Audio<br>Language<br>Tag`,
            `Code`,

            `Long<br>Description<br>1`,
            `Audio<br>Language<br>Display Name 1`,
            `Visual<br>Language<br>Tag 1/th>`,
            `Visual<br>Language<br>Display Name 1`,

            `Long<br>Description<br>2`,
            `Audio<br>Language<br>Display Name 2`,
            `Visual<br>Language<br>Tag 2`,
            `Visual<br>Language<br>Display Name 2`
        ],
        render_th: mtemplate.render.th
    }
    let row_data = { row: [], render_tr: mtemplate.render.tr }
    let cell_data = { cell: [], render_td: mtemplate.render.td }

    let term = await xmlh.get_first_term_as_JSON(xml)

    for (let t in term) {
        //only include non-group entries
        if (!xmlh.is_group_term(term[t])) {
            //reset the cell data
            cell_data.cell = []

            cell_data.cell.push(xmlh.text_of(term[t], 'termID'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termName'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Language Group Tag'))

            //Handle the termNote fields
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Audio Language Tag'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Code'))

            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Long Description 1'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Audio Language Display Name 1'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Visual Language Tag 1'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Visual Language Display Name 1'))

            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Long Description 2'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Audio Language Display Name 2'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Visual Language Tag 2'))
            cell_data.cell.push(xmlh.text_of(term[t], 'termNote', 'label', 'Visual Language Display Name 2'))

            row_data.row.push(mustache.render(mtemplate.td, cell_data))
        }
    }
    return `<table class="table table-sm table-striped table-bordered small">` +
        mustache.render(mtemplate.th, heading_data) + `\n` +
        mustache.render(mtemplate.tr, row_data) + `\n` +
        `</table>\n`
}


const route_uri = `/table-lang`
router.get(`${route_uri}`, async (ctx, next) => {

    //get the basic data for the page
    let view_data = lmt_body.view_data

    //get the raw lmt data or false
    let xml = lmt.xml()
    if (!xml) {
        ctx.status = 500
        log.error(`${ctx.status} route:${route_uri}`)
        return
    }

    //create a full width table of values (no gutters)
    let table_html = await make_lang_table(xml)
    view_data.rendered_output =
        config.get('static.html.full_width_start') + "\n" +
        table_html +
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