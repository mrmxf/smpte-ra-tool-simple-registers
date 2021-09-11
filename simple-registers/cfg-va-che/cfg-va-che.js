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
const convict = require('convict')

//default to development unless the user explicitly sets production
process.env.NODE_ENV = (process.env.NODE_ENV == undefined) ? "development" : process.env.NODE_ENV

//load in the defaults and the schema first
const defaultSchemaPath = `./config/config-convictSchema.json`
const defaultsPath = `./config/config-defaults.json`

let log = { info: console.log, error: console.log, warning: console.log }

let convictSchemaPath = defaultSchemaPath

//attempt to load the schema
let schema, schemaJson, config

try {
    schemaJson = fs.readFileSync(convictSchemaPath)
} catch (err) {
    log.error(`Failed to load config schema from ${convictSchemaPath}`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

try {
    schema = JSON.parse(schemaJson)
} catch (err) {
    log.error(`schema in ${convictSchemaPath} cannot be parsed`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

try {
    config = convict(schema)
} catch (err) {
    log.error(`config schema from ${convictSchemaPath}  has errors`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

//load defaults
try {
    config.loadFile(defaultsPath)
    log.info(`updating config from ${defaultsPath}`)
} catch (err) {
    log.warning(`Cannot load config file (${defaultsPath}), using defaults`)
}

try {
    config.validate();
} catch (err) {
    log.error(`defaults from ${defaultsPath} does not validate`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

//load overrides
const env = config.get("env")
const overridesPath = `./config/config-${env}.json`

try {
    config.loadFile(overridesPath)
    try {
        config.validate();
    } catch (err) {
        log.error(`overrides from ${overridesPath} do not validate`)
        log.error(`Giving up: ${err}`)
        process.exit(1)
    }
    log.info(`updating config from ${overridesPath}`)
} catch (err) {
    log.warning(`Cannot load config file (${overridesPath}), using defaults`)
}

const pino = require('pino')
//log to stderr by default
log = pino(config.get('logging'), pino.destination(2))


log.debug ("All Configuration Properties:")
log.debug(config.getProperties())
log.flush()

module.exports = config