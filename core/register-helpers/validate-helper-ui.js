/** @module convert-helper-ui */
/**
 * A helper that displays the validation options
 *
 * ```javascript
 *   const cvtList = cvt.loadConvertFromFolder("path/to/folder")
 *   const ui = require("path/to/convert-helper-ui")
 *   const html = ui.view(cfg, cvtList)
 * ```
 */
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const mdit = require('markdown-it')()

/** create the upload pane
 *
 * @param {Object} cfg - the plugins config.json with cfg._parent as the global
 * @param {Array} cvtList  - list of converter objects
 * @returns
 */
const sourceStep = (cfg, cvtList) => {
    let html = []

    let Md = `### Upload JSON

Use the upload button to upload you JSON for validation or paste your
content into the \`input box\`.
`
    html.push(mdit.render(Md))

    html.push(`<div class="ui fluid mini icon focus input ">`)
    // html.push(`   <div class="ui label">Source:</div>`)
    html.push(`  <textarea id="sourceText" type="text" style="width:100%" name="sourcetext" placeholder="Paste Source ..."></textarea>`)
    html.push(`  <i class="paste icon"></i>`)
    html.push(`</div>`)

    html.push(`<div id="uplaodOption" class="ui fluid segment" style="display: none">`)

    html.push(`  <p>... or upload a file ...</p>`)

    html.push(`  <button id="uploadButton" class="ui disabled labeled icon button">`)
    html.push(`    <i class="upload icon"></i>`)
    html.push(`    Select File to Upload`)
    html.push(`  </button>`)
    html.push(`</div>`)

    return html.join("\n")
}

const loadValidaterHelpHTML = (cfg, filename) => {
    let filePath = path.join(cfg._folderPath, cfg.folder.serverPath, cfg.folder.workerPath, filename)
    try {
        let md = fs.readFileSync(filePath, 'utf-8')
        try {
            return mdit.render(md)
        } catch (error) {
            return `<p>Help file ${filename} did not render ${error.message}.</p>`
        }
    } catch (error) {
        return "<p>No Help available.</p>"
    }
}

/** choose a conversion
 *
 * @param {Object} cfg - the plugins config.json with cfg._parent as the global
 * @param {Array} cvtList  - list of converter objects
 * @returns
 */
const selectionStep = (cfg, cvtList) => {
    let html = []
    let helpMsg = []

    let Md = `### 2. Select conversion

Select your conversion from the following list.
`
    html.push(mdit.render(Md))

    html.push(`<div class="ui form">`)
    html.push(`  <div class="grouped fields">`)
    html.push(`    <label for="cvt">Select Conversion:</label>`)

    let idSelectorCount = 1

    cvtList.forEach(converter => {
        if (converter.toSmpteId) {
            let id = converter.toSmpteId
            let hid = `help${id}`
            let lid = `label${id}`
            html.push(`      <div class="field">`)
            html.push(`        <div class="ui radio checkbox">`)
            html.push(`          <input type="radio" name="cvt" id="${id}" tabindex="0" class="hidden">`)
            html.push(`          <label id="${lid}">${converter.toSmpteLabel}</label>`)
            html.push(`        </div>`)
            html.push(`      </div>`)

            //now add the help text for this converter
            if (converter.toSmpteMdFile) {
                let helpHtml = loadValidaterHelpHTML(cfg, converter.toSmpteMdFile)
                helpMsg.push({ id: hid, html: helpHtml })
            }
        }
        if (converter.fromSmpteId) {
            let id = converter.fromSmpteId
            let hid = `help${id}`
            let lid = `label${id}`
            html.push(`      <div class="field">`)
            html.push(`        <div class="ui radio checkbox">`)
            html.push(`          <input type="radio" name="cvt" id="${id}" tabindex="0" class="hidden">`)
            html.push(`          <label id=${lid}>${converter.fromSmpteLabel}</label>`)
            html.push(`        </div>`)
            html.push(`      </div>`)

            //now add the help text for this converter
            if (converter.fromSmpteMdFile) {
                let helpHtml = loadValidaterHelpHTML(cfg, converter.fromSmpteMdFile)
                helpMsg.push({ id: hid, html: helpHtml })
            }
        }
        idSelectorCount++
    })
    html.push(`  </div>`)
    html.push(`</div>`)
    //output the help HTML - initially invisible
    helpMsg.forEach(m => {
        html.push(`<div id="${m.id}" class="ui segment" style="display: none">`)
        html.push(m.html)
        html.push(`</div>`)

    })
    //initialise the checkbox code
    // html.push(`<script>$('.ui.radio.checkbox').checkbox();</script>`)

    return html.join("\n")
}

/** do the conversion
 *
 * @param {Object} cfg - the plugins config.json with cfg._parent as the global
 * @param {Array} cvtList  - list of converter objects
 * @returns
 */
const doConversionStep = (cfg, cvtList) => {
    let html = []

    let Md = `### 3. Do the conversion

Do the conversion and when ready, validate or diff or download.
`
    html.push(mdit.render(Md))

    html.push(`<button class="ui labeled icon button" tabindex="0" id="doConversion">`)
    html.push(`<i class="play icon"></i>`)
    html.push(`Do Conversion`)
    html.push(`</button>`)

    return html.join("\n")
}

module.exports.html = (cfg, cvtList) => {
    let html = []

    html.push(`<div class="ui three column grid">`)
    html.push(`  <div class="column">`)
    html.push(`    <div class="ui segment">`)
    html.push(sourceStep(cfg, cvtList))
    html.push(`    </div>`)
    html.push(`  </div>`)
    html.push(`  <div class="column">`)
    html.push(`    <div class="ui segment">`)
    html.push(selectionStep(cfg, cvtList))
    html.push(`    </div>`)
    html.push(`  </div>`)
    html.push(`  <div class="column">`)
    html.push(`    <div class="ui segment">`)
    html.push(doConversionStep(cfg, cvtList))
    html.push(`    </div>`)
    html.push(`  </div>`)
    html.push(`</div>`)

    return html.join("\n")
}