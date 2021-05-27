/** @module lib-xml-helper
 *  return index page
 * 
 * load index.template and use mustache to update
 * with the xml view
 * 
*/
const esc = require('escape-html')
const xml2js = require('xml2js')

/** true if this is a group term
 * 
 * identified by the termVocabulary element equalling `Language Groupings LMT`
 */
module.exports.is_group_term = function (term) {
    if (!term.termNote)
        return false

    const group_label = 'Language Group Name'
    let is_a_group= false

    //now see if that label exists on a termNote
    term.termNote.forEach((e) => {
        if (e && e.$ && e.$.label && (e.$.label == group_label)) {
            is_a_group= true
        }
    })
    return is_a_group
}

/** get the escaped text of an element with a Value of the LMT term matching a given Attribute label
 * e.g. text_of(term[t], 'termNote', 'label', 'Audio Language Tag')
 */
module.exports.text_of = function (term, element, attribute, attribute_value) {
    let txt = '&nbsp;'

    //assuming the element exists
    if (term && term[element]) {
        txt = esc(term[element][0])
        // under some circumstances (e.g. getting a language code for written languages)
        // the inner HTML might be an object at this point. If so, then there is no valid
        //value - set to empty string
        if (typeof term[element][0] == 'object') {
            txt = '&nbsp;'
        }

        //now match any label if the function was called to match a label
        term[element].forEach((e) => {
            if (e && e.$ && e.$[attribute] && (e.$[attribute] == attribute_value)) {
                //this element has the right attribute so extract the value
                txt = esc(e._)
            }
        })
    }
    return txt
}

async function get_xml_as_JSON(xml) {
    //convert XML to JSON
    let parser = new xml2js.Parser()
    return parser.parseStringPromise(xml)
}

module.exports.get_xml_as_JSON = get_xml_as_JSON

/** get the convert LMT to JSON and return the first term elememt
 */
module.exports.get_first_term_as_JSON = async function (xml) {
    let lmt_json= await get_xml_as_JSON(xml)
    return lmt_json["Synaptica-ZThes"].term
}

/** common mustache templates for views
 * 
 * define mustache templates to render an array of heading, row, cell
 * note the 3 braces around the render function to prevent HTML escaping
 */
module.exports.mustache_template = {
    th: `<tr>{{#heading}}{{{render_th}}}{{/heading}}</tr>\n`,
    tr: `{{#row}}{{{render_tr}}}{{/row}}\n`,
    td: `{{#cell}}{{{render_td}}}{{/cell}}\n`,
    render: {
        th: function () {/* each heading cell     */ return `<th scope="col" class="text-center">${this}</th>` },
        tr: function () {/* each row in the table */ return `<tr>${this}</tr>\n` },
        td: function () {/*each cell  in the row  */ return `<td>${this}</td>` },
    },
    alert:{
        success:`<div class="alert-success" role="alert">{{ alert }}</div>`,
        successss:`<div class="alert alert-primary" role="alert">{{ alert }}</div>`,
        warning:`<div class=" alert-warning" role="alert">{{ alert }}</div>`,
    },
    validation:{
        success:`<div class="alert-success p-5" role="alert">{{ alert }}</div>`,
        error: `<div class="alert-danger p-5" role="alert">{{ alert }}`,
        error_message: `<li>line {{ line }} column {{ column }} - {{ message }}</li>`,
    },
}