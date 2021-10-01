/** @module menu */
/**
 * Display the secondary menu
 * usage: html = menu.html(registerConfigObject)
 * 
 * @param {Object} cfg The config.json as a JAvascript object
 */

module.exports.html = (cfg) => {
    const _r = cfg._routes

    return (
        `<div class="ui secondary menu">
            <!-- Home -->
            <a class="item" href="${_r.home}"><i class="home icon"></i>${cfg.menu}</a>
            <!-- ux json -->
            <a class="item" href="${_r.jsonData}/json"><i class="data icon"></i>Json</a>
            <!-- ux schema -->
            <a class="item" href="${_r.jsonSchema}/json"><i class="data icon"></i>Schema</a>
            <!-- Right aligned menu item -->
            <div class="right item">
                <a class="item">API endpoints:</a>
                <a class="item" href="${_r.register}"><i class="document icon"></i>Document</a>
                <a class="item" href="${_r.schema}"><i class="json icon"></i>Register</a>
                <a class="item" href="${_r.document}"><i class="json icon"></i>Schema</a>
            </div>
        </div>
     `
    )
}