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
//load in the defaults and the schema first
const defaultSchemaPath = `./config/config-convictSchema.json`
const defaultsPath = `./config/config-defaults.json`

let log = { info: console.log, error: console.log, warning: console.log }
config.loadFile(defaultPath)
//validate
config.validate({ allowed: 'strict' })

let convictSchemaPath = defaultSchemaPath

//attempt to load the schema
let schemaJson

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
try {
    const env = config.get("NODE_ENV")
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
} catch (e) {
    log.warning(`environment NODE_ENV unset; overrides not loaded`)

}


const pino = require('pino')
//log to stderr by default
log = pino(config.get('logging'), pino.destination(2))


log.debug("All Configuration Properties:")
log.debug(config.getProperties())
log.flush()

module.exports = config