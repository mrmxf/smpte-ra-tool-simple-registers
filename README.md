# smpte-ra-tool-core

## TODO

* Add JEST and some test scripts for the core
* Add jest test scripts on enumerated registers before deploy

## Introduction

**SMPTE Registration Authority Tool** for publishing and viewing **simple registers**.
These are typically a single JSON, YAML or XML file that represents a controlled vocabulary of some kind.

This is a refactor of the work that led to the Langage Metadata Table in SMPTE. This framework:

* hosts subprojects in their own folders `registers/`
* uses [Fomantic UI](https://fomantic-ui.com/) for theming & controls (compiled into `public/sui/`)
* uses [Markdown-it](https://github.com/markdown-it) for rendering markdown
* uses [mustache](https://mustache.github.io/) for substituting content at runtime
* uses [pinojs](https://github.com/pinojs/pino) for logging
* uses [xml2js](https://www.npmjs.com/package/xml-js) for handling XML
* uses [hyperjump](https://github.com/hyperjump-io/json-schema-validator) for JSON schema

## Usage

Install [yarn], then follow instructinos below to install dependencies, and init thes ubmodules that contain the registers. Finally, start tha aerver and open a browser to view the registers. To contain everything in a docker application for easy deployment - see the docker section below.

To install with yarn & populate all the git submodules in `registers/`...

```sh
git clone https://github.com/mrmxf/smpte-ra-tool-simple-registers.git
git submodule init
git submodule update
# now install dependencies
yarn
# set for development mode
NODE_ENV=development
#tweak development configuration
nano config/config-development.json
# Assuming success start the server using the defaults
yarn start
```

If you want to **add a new** git submodule to `registers/` then do the following. Note that `--depth 1` is important if multiple users are updating the register as a submodule. Git will break if you're not careful.

```sh
#ensure a shallow clone
git submodule add --depth 1 <git module-uri> registers/<register-name>
#label the register as shallow
git config -f .gitmodules submodule.registers/<register-name>.shallow true
git commit -m "Added submodule <register-name> (shallow)"
# finally install dependencies
yarn
```

If you need to **remove** a managed register from `registers/`...

```sh
git submodule deinit registers/<register-name>    # e.g. git submodule deinit   registers/smpte-reg-lmt
git rm registers/<register-name>                  # e.g. git rm                 registers/smpte-reg-lmt
git commit -m "Removed submodule <register-name>" # e.g. git commit -m "removed submodule smpte-reg-lmt"
rm -rf .git/modules/registers/<register-name>     # e.g. rm -rf    .git/modules/registers/smpte-reg-lmt
```

## configuration

The Server uses [convict](https://www.npmjs.com/package/convict) for configuration.
All config files are validated against the schema in `config/config_defaults+schema.json`.
Please read that file for details of what the configuration properties do.

Configuration values are loaded in the following order. Later files override earlier files.
If a file does not exist, then it is silently skipped.  A capitalised name in parenthesis
e.g. `<NODE_ENV>` means the value of the environment variable `NODE_ENV` e.g. `production`
or `development`.

1. `config/config-convictSchema.json`
2. `config/config-defaults.json`
3. `config/config-<NODE_ENV>.json`
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

## How it works

### Page rendering

A page is a collection of data in an javascript object that is substituted into a template.
The substitution engine is the super simple [mustache.io](https://mustache.github.io/).
Typically text is written in [Markdown - CommonMArk](https://spec.commonmark.org/)
and rendered using [markdfown-it](https://github.com/markdown-it/markdown-it) into HTML,
stored in a data structure and then substituted into the template. All styling
and controls are done with [fomantic-ui](fomantic-ui).

The basic functionality is performed in [lib-coreTemplate.js]

Tips:

* To put raw HTML into mustache use an ampersand `{{text.with_escaped_HTML}}` `{{&text.in_raw_HTML}}`
* Properties in the main template
* `{{googleTagManagerId}}` Array of Google tage manager IDs
* `{{appTitle}}` Name of the App
* `{{&menuForThisRegister}}` raw HTML for the menu items of the current register
* `{{&menuForListOfRegisters}}` raw HTML for the list of registers
* `{{&notificationMessages}}` raw HTML for any notification messages
* `{{&registerSecondaryMenu}}` raw HTML for a secondary menu (if there is one)
* `{{&wrapperOpen}}` for opening wrapper to surround the narrative and UI oriented view
* `{{pageNarrative}}` narrative for the current page
* `{{&textView}}` raw HTML to be displayed in a textual context (gutters and native styling)
* `{{&wrapperClose}}`for closing wrappers
* `{{&dataView}}` raw HTML for a view where you control margins, gutters animation etc.

[lib-coreTemplate.js]:simple
[yarn]:https://classic.yarnpkg.com/lang/en/docs/install
