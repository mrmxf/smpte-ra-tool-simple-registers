/** @module ui-doc */

//  Copyright ©2022 Mr MXF info@mrmxf.com
//  MIT License https://opensource.org/licenses/MIT

/** JSDoc documentation for the ui controls
 *
 * Type Definitions
 *
 * The render response is common to every widget, pane & page
 *
 * @typedef {Object} uiRrenderResponse
 * @property {number} status - the http return status of this rendering
 * @property {string} html - a string with the html for inserting into ctx.body
 *
 * Page options
 *
 * @typedef uiPageFileWorkflowOpt
 * @param          {string} paneTitle Title for page & Title block
 * @param           {string} pageHelp Text that appears near the title
 * @param              {string} route key the current route from the config file
                                    * e.g. `convert` to use `cfg.routes.convert`
 * @param    {string} breadCrumbsMenu Optional html string displaying for breadcrumbs
 * @param    {uiPaneSourceOpt} source options for a source pane (reference)
 * @param {uiPaneSourceOpt} candidate options for a source pane (candidate)
 * 
 * Pane Options
 * 
 * @typedef uiPaneSourceOpt
 * @property {string} label title for the pane
 * @property              {string} nameId used for both the `name` and `id` 
                                *  attributes of the inne control.
                                * - `{{nameId}}-container` = outer div `id`
                                * - `{{nameId}}-button` = action button `id`
 * @property {uiWidgetRadioButton} radio
 * @property    {uiWidgetPasteBox} pasteBox
 * @property    {uiWidgetUploader} uploader
 * 
 * Widget Options
 * 
 * @typedef {Object} uiWidgetRadioButton
 * @property            {array} label button label to be displayed
 * @property            {string} type static | upload | paste
 * @property      {boolean} isChecked one button in the group
 * @property      {string} serverPath to static resource when `type`==`static`
 * @property       {Array} uploadText text for upload button when `type`==`upload`
 * @property {Array} pasteInputHeight (optional) height parameter for paste box
 *                                    when `type`==`paste`
 *
 * @typedef {Object} uiRadioGroupOpt
 * @property {string} nameId - name/id of the control group
 * @property {string} label - (optional) display label for the group
 * @property {uiRadioButton[]} buttons - an array of radio buttons
 *
 * @typedef {Object} uiWidgetTextArea
 * @property          {string} nameId HTML name of the text area
 * @property {string} placeholderText (optional) placeholder text
 * @property          {bool} isHidden is it initially hidden?
 * 
 * @typedef {Object} uiWidgetUploader
 * @property              {string} id HTML id of outer div
 * @property            {string} name HTML name & id of the text area
 * @property {string} placeholderText (optional) placeholder text
 * @property          {bool} isHidden is it initially hidden?
 * 
 */
