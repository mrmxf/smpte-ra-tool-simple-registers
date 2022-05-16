/** @module ui-page-file-workflow */
//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** Module to process files in 3 stages
 * param={
 * title: "THe title of the workfloe"
 *    }
 * 
 */

 module.exports.renderPage = (ctx, cfg, menu, opts)=>{
    return {
        status: 200,
        body: menu.html()+`<h1>${opts.title}</h1>`}
}
