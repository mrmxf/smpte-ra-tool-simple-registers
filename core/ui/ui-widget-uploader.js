/** @module ui-widgets */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Upload widget
 * renders fomantic html
 * 
 * @param           {Object} ctx Koa context object
 * @param           {Object} cfg Register configuration object
 * @param {uiWidgetUploader} opt options for the uploader
 * @returns  {uiRrenderResponse} status and html outputs
 */

 module.exports.renderUploader = (ctx, cfg, opt) => {
    let htm = []

    let hide = (opt.isHidden) ? `style="display:none;"` : ""
    htm.push(`<div ${hide} id="${opt.nameId}-container" class="ui fluid action input ">`)

    htm.push(`    <input  id="${opt.nameId}"        name="${opt.nameId}" type="text" placeholder="${opt.placeholderText}" />`)
    htm.push(`    <button id="${opt.nameId}-button"  class="ui button">Select File</button>`)
    htm.push(`</div>`)

    return {
        status: 200,
        body: htm.join("\n")
    }
}