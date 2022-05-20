/** @module ui-pane */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Module to display a pane with UI elements */

const radioButtons = require(`./ui-widget-radio`)
const textArea = require(`./ui-widget-text-area`)
const uploader = require(`./ui-widget-uploader`)

/** return the radio button selector and any extra components (up/download)
 * 
 * @param {uiPaneSourceOpt} opt options for the source pane (see ui-doc)
 * @returns {uiRrenderResponse}
 */
module.exports.renderPane = (ctx, cfg, opt) => {
  let radio = radioButtons.renderRadioGroup(ctx, cfg, opt.radio)
  let pasteBox = textArea.renderTextArea(ctx, cfg, opt.pasteBox)
  let upload = uploader.renderUploader(ctx, cfg, opt.uploader)

  let htm= []

  //emit the pane title with an accordian button
  htm.push(`<div id="${opt.nameId}-container" class="title">`)
  htm.push(`  <i class="dropdown icon"></i>`)
  htm.push(`  ${(opt.label) ? opt.label : ""}`)
  htm.push(`</div>`)


  //emit the widgets
  htm.push(`<div class="content">`)
  htm.push(radio.body)
  htm.push(pasteBox.body)
  htm.push(upload.body)
  htm.push(`</div>`)

  return {
    status: radio.status,
    body: htm.join("\n")
  }
}
