/** @module sample-register-convert-xml */
/**
 * toSmpte(str) converts a XML to json (without validation)
 * fromSmpte(str) converts json to XML (without validation)
 */
const xml2js = require('xml2js')

/**
 *
 * @param {String} xmlString the xml to be converted to json
 */

module.exports.toSmpte = async (xmlString) => {

    return new Promise(resolve => {
        //the sample parser only makes arrays when needed, discards the root element & ignores attributes
        let parser = new xml2js.Parser({ explicitArray: true, explicitRoot: false, ignoreAttrs: true })
        const obj = parser.parseStringPromise(xmlString, { reversible: false })
            .then(jsonObject => {
                // we know that xml to JSON needs special help. In the specific conversion
                // for this sample the xml will generate an extra object called item:[]
                // in the canonical JSON this is the root object, so adjust the response
                if (jsonObject.item && Array.isArray(jsonObject.item)) {
                    jsonObject = jsonObject.item
                    resolve({ status: 200, body: JSON.stringify(jsonObject, undefined, 2) })
                } else
                    resolve({ status: 400, body: `Bad Request - sample xml missing root/item array - conversion to json failed.` })
            })
            .catch(err => {
                resolve({ status: 400, body: `Bad Request - xml conversion to json failed </br>\n ${err}` })
            })
    })
}

module.exports.fromSmpte = async (jsonString) => {
    let ctx = {}
    let jsonObject

    try {
        jsonObject = JSON.parse(jsonString)
    } catch (err) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - json conversion to xml failed </br>\n ${err.message}`
        return ctx
    }

    let builder = new xml2js.Builder();

    // xml2js has a canonical way to represent things like
    // arrays. Lets munge the json to create the representative XML

    //if there is one object in a JSON object then xml2js assumes it's the names of the root object.
    //xml cannot represent arrays as the root, so insert an item wrapper to become XML friendly
    jsonObject = { root: {item: jsonObject} }

    try {
        const xmlDoc = builder.buildObject(jsonObject)

        //on success we get a string
        ctx.status = 200
        ctx.body = xmlDoc
    } catch (err) {
        ctx.status = 400 //Bad Request
        ctx.body = `Bad Request - json conversion to xml failed </br>\n ${err.message}`
    }
    return ctx
}