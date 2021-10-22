/* Autoload - homepage
 * initialize accoridans  & radio-buttons
*/
$(document).ready(function () {
    $('.ui.accordion').accordion()
    $('.ui.radio.checkbox').checkbox()
    //open the first accordian
    $(".ui.accordion").accordion("open",0)
})
