/** @module config-process */

const fs = require('fs')
const path = require('path')
const convict = require('./inc/config-process')

//load in the defaults and the schema first

const schemaPath= path.join('config', 'schema_defaults.json')
var config = convict()
module.exports = config