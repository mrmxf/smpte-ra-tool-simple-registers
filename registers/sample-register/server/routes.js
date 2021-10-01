/** @module routes */
/** enumerate the routes for this plugin */


module.exports.init = (cfg) => {
    const home = cfg.urlPrefix
    module.exports.home = home

    //these routes can vary between plugins
    module.exports.jsonData = `${home}/${cfg._routes.jsonData}`
    module.exports.jsonSchema = `${home}/${cfg._routes.jsonSchema}`

    //these routes should be consistent between plugins
    module.exports.register = `${home}/${cfg._routes.register}`
    module.exports.schema = `${home}/${cfg._routes.schema}`
    module.exports.document = `${home}/${cfg._routes.document}`
}
