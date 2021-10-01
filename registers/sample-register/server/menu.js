/** @module menu */
/**
 * Display the secondary menu
 * usage: html = menu.html(registerConfigObject)
 *
 * @param {Object} cfg The config.json as a JAvascript object
 */

module.exports.html = (cfg, activeRoute) => {
    const _r = cfg._routes

    let aHo = (activeRoute == _r.home) ? " active " : ""
    let aJD = (activeRoute == _r.jsonData) ? " active" : ""
    let aJS = (activeRoute == _r.jsonSchema) ? " active" : ""

    return (
        `<div class="ui secondary menu">
            <!-- Home -->
            <a class="item${aHo}" href="${_r.home}"><i class="home icon"></i>${cfg.menu}</a>
            <!-- ux json -->
            <a class="item${aJD}" href="${_r.jsonData}"><i class="data icon"></i>Json</a>
            <!-- ux schema -->
            <a class="item${aJS}" href="${_r.jsonSchema}"><i class="data icon"></i>Schema</a>
            <!-- Right aligned menu item for full screen items-->
            <div class="right item">
                <div class="header item">API endpoints:</div>
                <a class="item" href="${_r.register}"><i class="document icon"></i>Register</a>
                <a class="item" href="${_r.schema}"><i class="json icon"></i>Schema</a>
                <a class="item" href="${_r.document}"><i class="json icon"></i>Document</a>
            </div>
        </div>
     `
    )
}