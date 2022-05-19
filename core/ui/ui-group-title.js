/** @module ui-group */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Module to group together UI elements
 * 
 * see ui-page-file-workflow for common opt properties
 */
 module.exports.renderGroup = (ctx, cfg, menu, opt) => {
     return `
     <div class="title">
       <i class="dropdown icon"></i>
       ${opt.pageTitle}
     </div>
     <div class="content">
       <p class="transition hidden">${opt.pageHelp ? opt.pageHelp : ""}</p>
     </div>`
 }
