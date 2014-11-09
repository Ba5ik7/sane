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

module.exports = async function newProject(name, options) {
  options.database = normalizeOption(options.database);

  //Creates the new folder
  execAbort.sync('mkdir ' + name, 'Error: Creating a new folder failed. Check if the folder \'' + name + '\' already exists.');
  //change directories into projectRoot
  cd(name);

  fs.writeFileSync(path.join('fig.yml'), prepareTemplate('fig.yml', options.database));

  await execAbort.async('fig run server sails new .', 'Error: Creating a new sails project failed',
    'Setting up Sails project and downloading latest Docker Containers. Give it some time',
    'Sails container successfully created.');

  var progress = new PleasantProgress();
  progress.start(chalk.green('Installing Sails dependencies'));

  await execAbort.async('fig run server npm i sails-generate-ember-blueprints --save');
  await execAbort.async('fig run server npm i sails-generate-ember-blueprints --save');
  await execAbort.async('fig run server npm i sails-generate-ember-blueprints --save');

  if (options.database === 'postgres') {
    await execAbort.async('fig run server npm i --save sails-postgresql');
  } else if (options.database !== 'disk') {
    await execAbort.async('fig run server npm i --save sails-' + options.database);
  }

  progress.stop();
  console.log(chalk.green('Sails dependencies successfully installed.'));
  //Creating new ember project
  await execAbort.async('ember new client', 'Error: Creating a new Ember Project failed',
    'Creating Ember Project, installing bower and npm dependencies',
    'Ember Project successfully created.');

  //copy over prepared files
  var templates = templatesEndingWith(projectMeta.sanePath(), '_models', options.database);
  for (var i = 0; i < templates.length; i++) {
    var templateInPath = path.join(projectMeta.sanePath(), 'templates', templates[i]);
    var templateOutPath = renameTemplate(templates[i]);
    fs.outputFileSync(templateOutPath, fs.readFileSync(templateInPath));
  }
  console.log(chalk.green('SANE Project \'' + name + '\' successfully created.'));
};