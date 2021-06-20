/** @module config-process */

const fs = require('fs')
const path = require('path')
const convict = require('convict')

//load in the defaults and the schema first
const schemaPath = path.join('config', 'config_defaults+schema.json')
let schema = fs.readFileSync(schemaPath)

//initialise the config object by loading configs in order
let config = convict(JSON.parse(schema))

//validate
config.validate({ allowed: 'strict' })

if (config.get("DEBUG"))
    console.log(config.getProperties())

module.exports = config