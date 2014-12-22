# SANE Stack Changelog

### master
* [ENHANCEMENT] After installing `sane-cli` it now checks for presence of `ember-cli` and `sails` automatically

### 0.0.14
* [FEATURE] Added [https://github.com/expressjs/morgan](morgan) hook to sails app so each http request gets logged
* [FEATURE] Added `sane new --skip-npm --skip-bower` flags to skip npm and bower installation.
* [FEATURE] You can now rename your client/server folders, by renaming them and then adding the new name to your .sane-cli `apps`. See Docs for details
* [BREAKING ENHANCEMENT] On windows and mac your sails-container-server gets automatically forwarded to localhost. Right now only supports the fixed 1337 porty. Removed the `--port-forward/-p` flag.
* [ENHANCEMENT] `pod` option is now supported in your `.sane-cli`
* [BUGFIX] Changed tracking code to an GA App
* [BREAKING BUGFIX] For consistency the short version of the `--docker` flag is now `-D` for all commands

### 0.0.13
* [ENHANCEMENT] Updated `fs-extra` to 0.13.0
* [ENHANCEMENT] Switched again to `traceur` so no compilation step is needed.
* [FEATURE] Added new feature behind `sane up -p` flag, to forward docker IP to localhost (using boot2docker).

### 0.0.12
* [BUGFIX] Fixed `sane generate resource` command.

### 0.0.11
* [BUGFIX] Fixed & improved database setup and config
* [ENHANCEMENT] Switched to [traceur](https://github.com/google/traceur-compiler) for easier development and fewer dependencies
* [ENHANCEMENT] Disabled grunt hook for sails per default which should reduce CPU usage
* [ENHANCEMENT] Added package.json to root folder, preparing for having a local sane-cli in the future
* [ENHANCEMENT] Added .editorconfig for better development consistency
* [FEATURE] Added `--live-reload` option to `sane up` to proxy through to `ember-cli`
* [ENHANCEMENT] Added anonymous google analytics tracking for sane-cli usage that can be disabled in the .sane-cli via the `disableAnalytics` option

### 0.0.10
* [BUGFIX] fixed missing comma in connections.js

### 0.0.9
* [ENHANCEMENT] Updated [es6-shim](https://github.com/paulmillr/es6-shim) to 0.21.0
* [BUGFIX] Fixed setup of blueprints for ember-data, as well as the right database adapter. Would recommend to setup the project new, or run the following commands in the `server` folder: `npm i sails-generate-ember-blueprints --save`, `npm i lodash --save`, `npm i pluralize --save`, `sails generate ember-blueprints` and depending on your database: `npm i --save sails-mongo`

### 0.0.8
* [ENHANCEMENT] Made installation of Docker optional to get quick dev setup running.
* [FEATURE] Added basic `sane up` command. To start with docker add `--docker` flag
* [FEAURE] Added possibility to add a .sane-cli in your project root and/or home directory so you don't have to specifiy cli options such as --docker with each command
* [FEAURE] Added `sane generate resource name attribue:type` command, to add models on the frontend as well as the backend
* [ENHANCEMENT] Now showing proper docker ip on `sane up --docker`
* [ENHANCEMENT] Now showing better log output when setting up new project.
* [BUGFIX] Does not create git repo within client folder anymore

### 0.0.6
* [ENHANCEMENT] Updated [commander.js](https://github.com/tj/commander.js) to 2.5.0
* [FEATURE] added `--verbose` flag to `sane new` command to display more output for debugging purposes
* [BUGFIX] Fixed an issue that the setup would never complete if no db (or disk) was given

### 0.0.5
* [ENHANCEMENT] Added pleasent-progress for better output of setup progress [#11](https://github.com/artificialio/sane/issues/11)

### 0.0.4

* [ENHANCEMENT] Changed to new, smaller and tagged docker container.
* [FEATURE] You can now specify latest or stable node versions in the fig.yml, as well as a fixed 0.10.32

### 0.0.3

* [FEATURE] added a basic CLI that can set up a Sails Container with Fig and a separate ember project, linking them together.
