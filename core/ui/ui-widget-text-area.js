/** @module ui-widgets */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Text Area  widget
 * renders fomantic html
 * 
 * @param           {Object} ctx Koa context object
 * @param           {Object} cfg Register configuration object
 * @param {uiWidgetTextArea} opt Text Areas Options
 * @returns  {uiRrenderResponse} status and html outputs
 */

module.exports.renderTextArea = (ctx, cfg, opt) => {
    let htm = []
    //remove padding from browser width calculations (no-auto scroll bar)
    htm.push(`<style>.boxsizingBorder {`)
    htm.push(`  -webkit-box-sizing: border-box;`)
    htm.push(`     -moz-box-sizing: border-box;`)
    htm.push(`         box-sizing: border-box;`)
    htm.push(`}</style>`)

    let hide = (opt.isHidden) ? `style="display:none;"` : ""
    htm.push(` <div ${hide} id="${opt.nameId}-container" class="ui fluid icon input">`)

    let wide= `style="width:100%;"`
    htm.push(`  <textarea name="${opt.nameId}" id="${opt.nameId}" ${wide} placeholder="${opt.placeholderText}"></textarea>`)
    htm.push(`  <i class="paste icon"></i>`)
    htm.push(` </div>`)

    return {
        status: 200,
        body: htm.join("\n")
    }
}