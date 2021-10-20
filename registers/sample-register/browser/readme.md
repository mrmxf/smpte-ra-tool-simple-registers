# registers/sample-register/browser

`browser/` holds files to be used in the browser. Files are named according
to routes and not according to what the menu title is. This allows for
translation of the GUI without changing code.

A register typically has deisplay routes (rather than endpoint routes) called
`jsonData`, `jsonSchema`, `convert`, `validate`, `diff` and the following
pages will be automatically loaded into the standard template:

* `autoload.js` is loaded on every page for the register
* `autoload-jsonData` loaded for route `/register/sample/jsonData`
* `autoload-jsonSchema` loaded for route `/register/sample/jsonSchema`
* `autoload-convert` loaded for route `/register/sample/convert`
* `autoload-validate` loaded for route `/register/sample/validate`
* etc.

You can, of course pull Javascript code from the server or use a different
template system with a different stylesheet if that makes you happy.
