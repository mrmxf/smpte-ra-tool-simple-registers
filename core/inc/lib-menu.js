/** @module lib-main-menu */

const config = require('../cfg-va-che/cfg-va-che.js')
const registers = require('../inc/lib-registers')

module.exports.getListOfRegistersMenu = (options) => {
    let registersHTML = ""
    for (let r in registers) {
        registersHTML +=
            `<a class="item" href="${registers[r].cfg._absRoute}">
              <i class="globe icon"></i>
              ${registers[r].cfg.menu}
             </a>`
    }

    let ListOfRegistersMenu = (
        `<div class="ui simple dropdown item">
           <i class="grid layout icon"></i>
           Registers
           <i class="dropdown icon"></i>
           <div class="menu">
             ${registersHTML}
           </div>
         </div>
        `
    )
    return ListOfRegistersMenu

}

module.exports.menu = () => {
    return {
        html: ``
    }
}