/** @module ui-widgets */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Radio buttons widget
 * 
 * renders fomantic html
 * @param                {Object}ctx Koa context object
 * @param                {Object}cfg Register configuration object
 * @param {uiWidgetRadioGroupOpt}opt Radio Buttons Group Object
 * @returns       {uiRenderResponse} status and html outputs
 */

module.exports.renderRadioGroup = (ctx, cfg, opt) => {
    let htm = []

    let hide = (opt.isHidden) ? `style="display:none;"` : ""
    htm.push(`<div ${hide} id="${opt.nameId}-container" class="grouped fields">\n`)
    if (opt.label){
        htm.push(`<label for="${opt.nameId}">${opt.label}</label>`)
    }
    opt.buttons.forEach(button => {
        htm.push(` <div id="${opt.nameId}" class="field">`)
        htm.push(`  <div class="ui radio checkbox">`)
        htm.push(`   <input type="radio" name="${opt.nameId}" value="${button.value}" tabindex="0" class="hidden" />`)
        htm.push(`   <label>${button.label}</label>`)
        htm.push(`  </div>`)
        htm.push(` </div>`)
    })
    htm.push(` </div>`)

    return {
        status: 200,
        body: htm.join("\n")
    }
}