/** @module ui-pane */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Module to display a pane with UI elements */

/** 
 * see ui-page-file-workflow for common opt properties
 */
 module.exports.renderPane = (ctx, cfg, opt) => {
     return {
       status: 200,
       body: `
     <div id="${opt.nameId}-container" class="title">
       <i class="dropdown icon"></i>
       ${opt.paneTitle}
     </div>
     <div class="content">
       <p id="${opt.nameId}" class="transition hidden">${opt.paneHelp ? opt.paneHelp : ""}</p>
     </div>`}
 }
