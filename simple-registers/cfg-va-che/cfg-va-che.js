/** @module cfg-va-che */
/**
 * ConFiguration with VAlidation & mustaCHE substitution
 *
 * Initially based on `npm convict` but later enhanced with
 * JSON schema for standards support and then mustache
 * substitution for more modular configuration
 *
 */
const fs = require('fs')
const path = require('path')
const convict = require('convict')

//load in the defaults and the schema first
const schemaPath = path.join('config', 'config-convictSchema.json')
const defaultPath = path.join('config', 'config-defaults.json')
let schema = fs.readFileSync(schemaPath)

//initialise the config object by loading configs in order
let config = convict(JSON.parse(schema))

//load the defaults
config.loadFile(defaultPath)

//overlay the -development or -production
const mode = process.env.NODE_ENV
const modalPath = path.join('config', `config-${mode}.json`)

//validate
config.validate({
    allowed: 'strict'
})

if (config.get("DEBUG"))
    console.log(config.getProperties())

module.exports = config