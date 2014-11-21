'use strict';

var execAbort = require('../execAbort');
var projectMeta = require('../projectMeta');
var fs = require('fs-extra');
var hbs = require('handlebars');
var path = require('path');
var templatesEndingWith = require('../tasks/templatesEndingWith');
var renameTemplate = require('../tasks/renameTemplate');
var PleasantProgress = require('pleasant-progress');
var chalk = require('chalk');
var checkEnvironment = require('../tasks/checkEnvironment');
// var spawn = require('child_process').spawn;
require('shelljs/global');
require('es6-shim');


function normalizeOption(option) {
  if (option === 'mongodb') {
    return 'mongo';
  }
  if (option === 'postgresql') {
    return 'postgres';
  }
  return option;
}

function prepareTemplate(name, option) {
  var figDatabase = null;
  var figPort = 0;
  var figIsMysql = false;

  if (option !== 'disk'){
    figDatabase = option;
  }

  switch (option) {
    case 'mysql':
    figPort = 3306;
    figIsMysql = true;
    break;
    case 'postgres':
    figPort = 5432;
    break;
    case 'mongo':
    figPort = 27017;
    break;
  }
  var figVariables = { database: figDatabase, port: figPort, isMysql: figIsMysql};
  var template = fs.readFileSync(path.join(projectMeta.sanePath(), name), 'utf8');
  template = hbs.compile(template);
  return template(figVariables);
}

module.exports = function newProject(name, options) {
  var silent, figRun, installMsg, successMsg, cliConfig, opt, progress, templates, i, templateInPath, templateOutPath;

  return regeneratorRuntime.async(function newProject$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      options.database = normalizeOption(options.database);
      silent = true;
      if (options.verbose) {
        silent = false;
      }

      figRun = '';
      installMsg = 'Setting up Sails project locally.';
      successMsg = 'project';

      if (!checkEnvironment.emberExists()) {
        console.log('sane requires the latest ember-cli to be installed. Run npm install -g ember-cli.');
        console.log('Exitting now.');
        process.exit(1);
      }

      //--docker is set
      if (options.docker) {
        figRun = 'fig run server ';
        installMsg = 'Setting up Sails project and downloading latest Docker Containers. Give it some time';
        successMsg = 'container';
        if (!checkEnvironment.dockerExists()) {
          console.log('sane requires the latest docker/boot2docker/fig to be installed. Check https://github.com/artificialio/sane/blob/master/README.md for more details.');
          console.log('Exitting now.');
          process.exit(1);
        }
      } else {
        if (!checkEnvironment.sailsExists()) {
          console.log('sane requires the latest sails to be installed. Run npm install -g ember-cli.');
          console.log('Exitting now.');
          process.exit(1);
        }
      }

      //Creates the new folder
      execAbort.sync('mkdir ' + name,
        'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.',
        silent);
      //change directories into projectRoot
      cd(name);

      fs.writeFileSync(path.join('fig.yml'), prepareTemplate('fig.yml', options.database));

      cliConfig = {};
      for (opt in options) {
        //exclude properties that are not cli options
        if (options.hasOwnProperty(opt)
          && !opt.startsWith('_')
          && ['commands', 'options', 'parent'].indexOf(opt) === -1) {
          cliConfig[opt] = options[opt];
      }
    }

      //creating a default .sane-cli based on the parameters used in the new command
      fs.writeFileSync(path.join('.sane-cli'), JSON.stringify(cliConfig, null, 2));

      //if docker is not set manually create the server folder and cd in
      if (!options.docker) {
        mkdir('server');
        cd('server');
      }

      context$1$0.next = 17;

      return execAbort.async(figRun + 'sails new .',
        silent,
        'Error: Creating a new sails project failed',
        installMsg,
        'Sails ' + successMsg + ' successfully created.');
    case 17:
      progress = new PleasantProgress();
      progress.start(chalk.green('Installing Sails dependencies'));

      context$1$0.next = 21;
      return execAbort.async(figRun + 'npm i sails-generate-ember-blueprints --save', silent);
    case 21:
      context$1$0.next = 23;
      return execAbort.async(figRun + 'npm i lodash --save', silent);
    case 23:
      context$1$0.next = 25;
      return execAbort.async(figRun + 'npm i pluralize --save', silent);
    case 25:
      context$1$0.next = 27;
      return execAbort.async(figRun + 'sails generate ember-blueprints', silent);
    case 27:
      if (!(options.database === 'postgres')) {
        context$1$0.next = 32;
        break;
      }

      context$1$0.next = 30;
      return execAbort.async(figRun + 'npm i --save sails-postgresql', silent);
    case 30:
      context$1$0.next = 35;
      break;
    case 32:
      if (!(options.database !== 'disk')) {
        context$1$0.next = 35;
        break;
      }

      context$1$0.next = 35;
      return execAbort.async(figRun + 'npm i --save sails-' + options.database, silent);
    case 35:
      //cd back out again
      if (!options.docker) {
        cd('..');
      }

      progress.stop();
      console.log(chalk.green('Sails dependencies successfully installed.'));
      context$1$0.next = 40;

      return execAbort.async('ember new client', silent, 'Error: Creating a new Ember Project failed',
        'Creating Ember Project, installing bower and npm dependencies',
        'Ember Project successfully created.');
    case 40:
      templates = templatesEndingWith(projectMeta.sanePath(), '_models', options.database);
      for (i = 0; i < templates.length; i++) {
        templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
        templateOutPath = renameTemplate(templates[i]);
        fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
      }
      console.log(chalk.green('SANE Project \'' + name + '\' successfully created.'));
    case 43:
    case "end":
      return context$1$0.stop();
    }
  }, null, this);
};