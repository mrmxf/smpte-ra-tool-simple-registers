# smpte-ra-tool-simple-registers

**SMPTE Registration Authority Tool** for publishing and viewing **simple registers**.
These are typically a single JSON, YAML or XML file that represents a controlled vocabulary of some kind.

This is a refactor of the work that led to the Langage Metadata Table in SMPTE. This framework:

* hosts subprojects in their own folders `registers/`
* uses [Semantic UI](https://semantic-ui.com/) for theming & controls (compiled into `public/sui/`)
* uses [Markdown-it](https://github.com/markdown-it) for rendering markdown
* uses [mustache](https://mustache.github.io/) for substituting content at runtime
* uses [pinojs](https://github.com/pinojs/pino) for logging
* uses [xml2js](https://www.npmjs.com/package/xml-js) for handling XML
* uses [hyperjump](https://github.com/hyperjump-io/json-schema-validator) for JSON schema

## Usage

'yarn run' will start the server using the defaults

## configuration

The Server uses [convict](https://www.npmjs.com/package/convict) for configuration.
All config files are validated against the schema in `config/config_defaults+schema.json`.
Please read that file for details of what the configuration properties do.

Configuration values are loaded in the following order. Later files override earlier files.
If a file does not exist, then it is silently skipped.  A capitalised name in parenthesis
e.g. `<NODE_ENV>` means the value of the environment variable `NODE_ENV` e.g. `production`

1. `config/config_defaults+schema.json`
2. `config/config.json`
3. `config/<NODE_ENV>.json`
4. `registers/<register>/config.json`

## structure

```text
├── registers
|   ├── project1
|   |   ├── config.json
|   |   ├── browser
|   |   |   ├── some.css
|   |   |   ├── someLogo.png
|   |   |   └── anotherRenderPlugin.js
|   |   ├── server
|   |   |   ├── someRenderPlugin.js
|   |   |   └── anotherRenderPlugin.js
|   |   └── smpte-process
|   |       ├── someFile.json
|   |       ├── someSchema.json
|   |       ├── someControlDoc.pdf
|   |       ├── someNarrative.md
|   |       └── someThingElse.xxx
```

Typically each register will be in its own Git project and installed
in the **registers** folder with a command like

```sh
# execute from the registers/ subfolder
#
cd registers
git submodule add --depth 1 git@github.com:smpte/<repoName>.git registers/
git config -f .gitmodules submodule.<repoName>.shallow true
```

for example

```sh
#   ├─ git submodule ├─ shallow    ├─ register repo                          ├─ relative folder location
git submodule add     --depth 1     git@github.com:mrmxf/smpte-reg-lmt.git   registers/smpte-reg-lmt/
git config -f .gitmodules submodule.spmte-reg-lmt.shallow true
```

## this modules functionality

1. It creates a default index page for all registers
2. It builds a common menu for all the registers from config metadata