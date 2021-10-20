/** @module sample-register-convert-yaml */
/**
 * toSmpte(str) converts a YAML to json (without checking)
 * fromSmpte(str) converts json to YAML (without checking)
 */
const yaml = require('js-yaml')

/**
 *
 * @param {String} yamlString the yaml to be converted to json
 */

module.exports.toSmpte = (yamlString) => {
    let ctx={}
    try {
        const jsonDoc = yaml.load(yamlString)
        ctx.status = 200
        ctx.body = JSON.stringify(jsonDoc, undefined, 2)

    } catch (err) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - yaml conversion to json failed </br>\n ${err.message}`
    }
    return ctx
}

module.exports.fromSmpte = (jsonString) => {

}