/** @module cfg-va-che */
/**
 * ConFiguration with VAlidation & mustaCHE substitution
 *
 * Initially based on `npm convict` but later enhanced with
 * JSON schema for standards support and then mustache
 * substitution for more modular configuration
 *
 * log all errors to console.log until succesful load and then log
 * success with pino
 */
const fs = require('fs')
const path = require('path')
const convict = require('convict')

let log = { info: console.log, warning: console.log, error: console.log, }

//load in the defaults and the schema first
const schemaPath = path.join('config', 'config-convictSchema.json')
const defaultPath = path.join('config', 'config-defaults.json')

//attempt to load the schema
let schema
try {
    schema = fs.readFileSync(schemaPath)
} catch (err) {
    log.error(`Failed to load config schema from ${schemaPath}`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

try {
    schema = JSON.parse(schema)
} catch (err) {
    log.error(`schema in ${schemaPath} cannot be parsed`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

let config
try {
    config = convict(schema)
} catch (err) {
    log.error(`config schema from ${schemaPath}  has errors`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

try {
    config.validate({ allowed: 'strict' });
} catch (err) {
    log.error(`default values in schema ${schemaPath} do not validate`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

//load defaults
try {
    config.loadFile(defaultPath)
} catch (err) {
    log.warning(`Cannot load config defaults from (${defaultPath})`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

try {
    config.validate();
} catch (err) {
    log.error(`defaults from ${defaultPath} do not validate against schema in ${schemaPath}`)
    log.error(`Giving up: ${err}`)
    process.exit(1)
}

//load overrides
let env
let modalPath
try {
    env = config.get("env")
    modalPath = path.join('config', `config-${env}.json`)
    try {
        config.loadFile(modalPath)
        try {
            config.validate();
        } catch (err) {
            log.error(`config modal overrides from ${modalPath} do not validate against schema in ${schemaPath}`)
            log.error(`Giving up: ${err}`)
            process.exit(1)
        }
    } catch (err) {
        log.warning(`Cannot load config file (${modalPath}), using defaults`)
    }
} catch (e) {
    log.warning(`environment NODE_ENV unset; overrides not loaded`)

}

// print some logging information about the config

log = require('pino')(config.get('logging'))
const serverName = config.get(`serverNameShort`) + ":"

log.info(`${serverName}       config schema loaded ${schemaPath}`)
log.info(`${serverName}     config defaults loaded ${defaultPath}`)

if (modalPath)
    log.info(`${serverName}    config overrides loaded ${modalPath}`)
else {
    if (env)
        log.info(`${serverName}    config overrides file   ${modalPath}`)
    else
        log.info(`${serverName} no config overrides loaded (set NODE-ENV environment variable to enable)`)
}

// log.debug("All Configuration Properties:")
// log.debug(config.getProperties())
log.flush()

module.exports = config