/** @module routes */
/** enumerate the routes for this plugin */


module.exports.init = (cfg) => {
    //The absRoute is constructed by the framework and is slash terminated
    const home = cfg._absRoute
    module.exports.home = home

    //these routes can vary between plugins
    module.exports.jsonData = `${home}${cfg.routes.jsonData}`
    module.exports.jsonSchema = `${home}${cfg.routes.jsonSchema}`
    module.exports.validate = `${home}${cfg.routes.validate}`
    module.exports.convert = `${home}${cfg.routes.convert}`
    module.exports.diff = `${home}${cfg.routes.diff}`

    //these routes **should** be consistent between plugins
    module.exports.register = `${home}${cfg.routes.register}`
    module.exports.schema = `${home}${cfg.routes.schema}`
    module.exports.document = `${home}${cfg.routes.document}`
}
