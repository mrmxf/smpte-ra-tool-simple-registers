/** @module lib-diff-s-col
 * export a 2 column difference output of two vocabulary
 * revisions
 */

let diff = require('deep-diff').diff
config = require('./cfg-va-che/cfg-va-che.js')
const log = require('pino')(config.get('logging'))
const esc = require('escape-html')

const style_add = config.get('static.style.diff.added')
const style_del = config.get('static.style.diff.deleted')
const style_unc = config.get('static.style.diff.unchanged')

let tbody_flag = false
/** create a row in the table from a diff object
 *
 * @param {Object} d - diff object
 * @returns {String} HTML
 */
function row(d) {
    let htm = ""
    htm += (d.hdr) ? `<thead>` : ''
    htm += `<tr>`
    htm += (d.hdr) ? `<th scope="col" class="diff "` : `<td class="diff" `
    htm += '>'
    for (let i = 0; i < d.depth; i++)
        htm += `&nbsp;`
    htm += esc(d.key)
    htm += (d.hdr) ? `</th><th class="diff "` : `</td><td class="diff" `
    htm += (d.ladd) ? style_add : ``
    htm += (d.ldel) ? style_del : ``
    htm += (!(d.ladd || d.ldel)) ? style_unc : ''
    htm += '>'
    for (let i = 0; i < d.depth; i++)
        htm += `&nbsp;`
    htm += esc(d.L)
    htm += (d.hdr) ? `</th><th class="diff "` : `</td><td class="diff" `
    htm += (d.radd) ? style_add : ``
    htm += (d.rdel) ? style_del : ``
    htm += (!(d.radd || d.rdel)) ? style_unc : ''
    htm += '>'
    for (let i = 0; i < d.depth; i++)
        htm += `&nbsp;`
    htm += esc(d.R)
    htm += (d.hdr) ? `</th>` : `</td>`
    htm += `</tr>\n`
    htm += (d.hdr) ? `</thead></tbody>` : ``
    return htm
}

/**
 *
 * @param {Object} a - the left hand object
 * @param {Object} b - the right hand object
 * @param {Number} depth - how deep in the stack (start at 0)
 */
function diff_element(diff_rows, a, b, depth) {
    let htm = ''
    for (let e in a[0]) {
        let diff = {
            key: e,
            depth: depth
        }
        let L = a[0][e][0]
        let R = b[0][e][0]
        if (typeof L == 'object') {
            //go the next layer down
            diff.L = ''
            diff.R = ''
            diff_rows.push(diff)
            htm += diff_element(diff_rows, a[0][e], b[0][e], depth + 1)
        } else {
            L = L.trim()
            diff.L = L

            if (undefined == R) {
                diff.rdel = true
                diff.ladd = true
                diff.R = ''
            } else {
                R = R.trim()
                diff.R = R
            }

            if (L !== R) {
                diff.ladd = true
            }
            diff_rows.push(diff)
        }
    }
}
/** create a 2 column HTML difference
 *
 * @param {LMT as JSON} a - reference
 * @param {LMT as JSON} b - reference
 */
module.exports = (a, b) => {

    /** the array of difference objects
     * {String} diff[n].element - tag and attribute as html
     * {String} diff[n].L - left hand text to display in a row as markdown - <b>character changes</b>
     * {String} diff[n].R - right hand text to display in a row as markdown - <b>character changes</b>
     * {Boolean} diff[n].ladd - highlight left column as add
     * {Boolean} diff[n].radd - highlight right column as add
     * {Boolean} diff[n].ldel - highlight left column as del
     * {Boolean} diff[n].rdel - highlight right column as del
     * {Number}  diff[n].depth - indentation depth
     * {Boolean} diff[n].hdr - True for header rows
     */
    let diff_rows = []
    //push a header
    diff_rows.push({ key: "", L: "LMT", R: "previous LMT", hdr: true })

    //deep clone the metadata
    let L = JSON.parse(JSON.stringify(a.Zthes.LMTMetadata))
    let R = JSON.parse(JSON.stringify(b.Zthes.LMTMetadata))
    //destructively diff them
    diff_element(diff_rows, L, R, 0)

    let term_a = a.Zthes.term
    let term_b = b.Zthes.term
    //deep clone the metadata
    L = JSON.parse(JSON.stringify(term_a))
    R = JSON.parse(JSON.stringify(term_b))
    //destructively diff them
    diff_element(diff_rows, L, R, 0)

    //Now create html from the diff_rows array
    let html = '<table calss ="table table-bordered table-hover">\n'
    for (let i in diff_rows) {
        html += row(diff_rows[i])
    }

    html += '</tbody></table>\n'
    return html
}