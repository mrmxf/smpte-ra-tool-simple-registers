/** @module sample-register-convert-yaml */
/**
 * toSmpte(str) converts a YAML to json (without checking)
 * fromSmpte(str) converts json to YAML (without checking)
 */
const yaml = require('js-yaml')

/** asynchronous function for converting TO Smpte format
 *
 * @param {String} yamlString the input yaml as a string
 * @returns {Object} ctx
 * @returns {Integer} ctx.status for returning as xml http request to framework
 * @returns {String } ctx.bidy for returning as xml http request to framework
 *
 */
module.exports.toSmpte = async (yamlString) => {
    let ctx = {}
    let warnings = []
    try {
        //make a list of warnings in addition to the conversion
        const jsonDoc = yaml.load(yamlString, { onWarning: w => warnings.push(w) })

        //on success we will get an object anything else has warnings or dodgy return values
        if ((typeof jsonDoc === `object`) && (warnings.length == 0)) {
            ctx.status = 200
            ctx.body = JSON.stringify(jsonDoc, undefined, 2)
            return ctx
        }

        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - yaml conversion to json had problems<br>\n`
        if (typeof jsonDoc !== `object`)
            ctx.body += `No JSON object was created<br>\n`
        warnings.forEach(w => ctx.body += `${w}<br>\n`)
        return ctx

    } catch (err) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - yaml conversion to json failed </br>\n ${err.message}`
        return ctx
    }
}

/** asynchronous function for converting FROM Smpte format
 *
 * @param {String} jsonString the input json as a string
 * @returns {Object} ctx
 * @returns {Integer} ctx.status for returning as xml http request to framework
 * @returns {String } ctx.bidy for returning as xml http request to framework
 *
 */
module.exports.fromSmpte = async (jsonString) => {
    let ctx = {}
    let warnings = []
    let jsonObject

    try {
        jsonObject = JSON.parse(jsonString)
    } catch (err) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - json conversion to yaml failed </br>\n ${err.message}`
        return ctx
    }

    try {
        //make a list of warnings in addition to the conversion
        const yamlDoc = yaml.dump(jsonObject, { indent: 2, lineWidth: -1 })

        //on success we get a string
        ctx.status = 200
        ctx.body = yamlDoc
    } catch (err) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - json conversion to yaml failed </br>\n ${err.message}`
    }
    return ctx
}