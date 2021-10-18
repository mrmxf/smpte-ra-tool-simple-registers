const Ajv = require("ajv/dist/2020")

module.exports.validate = (json, schema) => {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strictSchema: true
  })

  let response = {}
  let dataObject = {}
  let schemaObject = {}

  if (typeof (json) == "string")
    try {
      dataObject = JSON.parse(json)
    } catch (error) {
      response.ok = false
      response.error = error
      response.msg = error.message
      response.HTML = `
        <div class="ui negative message">
          <div class="header">
            <i class="exclamation circle icon"></i>
            Error Parsing JSON
          </div>
          <p>${response.msg}</p>
         </div>`
      return response
    }

  if (typeof (json) == "string")
    try {
      schemaObject = JSON.parse(schema)
    } catch (error) {
      response.ok = false
      response.error = error
      response.msg = error.message
      response.HTML = `
        <div class="ui negative message">
          <div class="header">
            <i class="exclamation circle icon"></i>
            Error Parsing JSON Schema
          </div>
          <p>${response.msg}</p>
         </div>`
      return response
    }

  let validate
  try {
    validate = ajv.compile(schemaObject)
  } catch (error) {
    response.ok = false
    response.error = error
    response.msg = error.message
    response.HTML = `
      <div class="ui negative message">
      <div class="header">
      <i class="exclamation circle icon"></i>
      Error Compiling JSON Schema
      </div>
      <p>${response.msg}</p>
      </div>`
    return response

  }


  const valid = validate(dataObject)
  if (!valid) {
    response.ok = false
    response.error = validate.errors
    response.HTML = `
        <div class="ui message">
          <div class="header">
            <i class="exclamation circle icon"></i>
            Error Validating JSON Document
          </div>`

    validate.errors.forEach(e =>{
      response.HTML += `
      <div class= "ui secondary segment">
      <div class="header">at ${e.instancePath}</div>
            ${e.message}
      <pre>${JSON.stringify(e.data, undefined, 2)}</pre>
      </div>
      `
    })
    response.HTML += `
         </div>`
    return response
  }
  return {
    ok: true,
    HTML: `
        <div class="ui positive message">
          <div class="header">
          <i class="check circle outline icon"></i>
            Register validates against Schema
          </div>
         </div>`
  }

}