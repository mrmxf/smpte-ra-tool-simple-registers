/* @module injected for the convert page */

/** trap changes in the conversion radio buttons to make the help information visible or invisible */
$('input[type=radio][name=cvt]').on('change', function () {
    let selectedId = $(this)[0].id
    let helpSelector = `#help${selectedId}`
    //hide all the divs with an id starting "helpid"
    $('div[id^=help]').hide()
    //show the one we want (if it exists)
    $(helpSelector).show()
})

/** handle the conversion button */
$('#doConversion').on('click', function () {
    let txt = $("#sourceText").val()
    if (txt.length < 10) {
        alert("Hmm that seems suspicious. Only " + txt.length + " characters? Really?")
        return
    }
    let cvtId = $('input[type=radio][name=cvt]:checked')[0].id
    // alert("alrighty lets do the " + cvt + " conversion")
    let data = {
        conversion: cvtId,
        sourceText: txt
    }
    $.post("", data)
        .done(function (responseText) {
            //success in the conversion. Use prism to format the output
            let cvtId = $('input[type=radio][name=cvt]:checked')[0].id
            let lblId = `label${cvtId}`
            let labelHtml = $(`#${lblId}`)[0].textContent
            let resHtml
            switch (cvtId) {
                default:
                    //display json
                    resHtml = `
                    <div class="ui green padded basic center aligned segment">
                     <div class = "ui positive message">
                      <div class="header">Conversion ${labelHtml}</div>
                     </div>
                     <div class="ui segment">
                      <pre><code class="language-js">${responseText}</code></pre>
                     </div>
                    </div>
                    `
            }
            $("#dataView").html(resHtml)
            Prism.highlightAll()
        })
        .fail(function (res) {
            $("#dataView").html(`
              <div class="ui red padded basic center aligned segment">
                <div class = "ui negative compact  message">
                <div class="header">Conversion Error Code ${res.status}</div>
                <p>${res.responseText}</p>
                </div>
              </div>
            `
            )
        })
        .always(function (res) { })
})