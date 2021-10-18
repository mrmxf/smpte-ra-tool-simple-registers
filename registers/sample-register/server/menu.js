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
    let aVa = (activeRoute == _r.validate) ? " active" : ""

    return (
        `<div class="ui secondary menu">
          <!-- Home -->
          <a class="item${aHo}" href="${_r.home}"><i class="home ${cfg.homeIconClass} icon"></i>${cfg.menu}</a>

          <!-- ux views -->
          <div class="ui simple dropdown item">
            <i class="eye icon"></i>  Views  <i class="dropdown icon"></i>

            <div class="menu">
              <a class="item${aJD}" href="${_r.jsonData}"><i class="code icon"></i>Json</a>
              <a class="item${aJS}" href="${_r.jsonSchema}"><i class="tasks icon"></i>Schema</a>
            </div>
          </div>

          <!-- ux Tools -->
          <div class="ui simple dropdown item">
            <i class="tools icon"></i>  Tools  <i class="dropdown icon"></i>

            <div class="menu">
            <a class="item${aVa}" href="${_r.convert}"><i class="exchange alternate icon"></i>Convert</a>
            <a class="item${aVa}" href="${_r.difference}"><i class="balance scale left icon"></i>Difference</a>
            <a class="item${aVa}" href="${_r.validate}"><i class="check circle outline icon"></i>Validate</a>
            </div>
          </div>

          <!-- Right aligned menu item for full screen items-->
          <div class="right item">
            <div class="ui simple dropdown item">
              <i class="robot icon"></i>  API endpoints  <i class="dropdown icon"></i>

              <div class="menu">
                <a class="item" href="${_r.register}"><i class="document icon"></i>Register</a>
                <a class="item" href="${_r.schema}"><i class="json icon"></i>Schema</a>
                <a class="item" href="${_r.document}"><i class="json icon"></i>Document</a>
              </div>
            </div>
          </div>
        </div>`
    )
}