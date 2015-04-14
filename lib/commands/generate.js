'use strict';

//with ES6 the same as: var spawn = require('child_process').spawn
var { spawn }         = require('child_process');
var chalk             = require('chalk');
var modelConversion   = require('../tasks/modelConversion');
var trackCommand      = require('../tasks/trackCommand');
var getAppNames       = require('../tasks/getAppNames');
var ember             = require('../helpers/ember');
var sails             = require('../helpers/sails');
var Project           = require('../tasks/Project');
var copyToProject     = require('../tasks/copyToProject');
var npmInstall        = require('enpeem').install;
var getTemplates      = require('../tasks/getTemplates');
var path              = require('path');
var fs                = require('fs-extra');
var dockerCompose     = require('../helpers/dockerCompose')();

var serverName = getAppNames.server();
var clientName = getAppNames.client();
var defaultBlueprints = ['api', 'resource'];
var project;
var addonBlueprints;

/**
 * @overview A generator is a one-time task that is being executed by sane.
 * These tasks usually are usually related to generating code, copying over files,
 * installing modules/addons or running sails and ember commands.
 * This function loads and runs all the existing generators in your project.
 * @param {String} blueprint - The name of the blueprint itself (e.g. resource)
 * @param {String} [name] - An extra, simple string parameter usually used for dynamic naming
 * @param {String} [attributes] - An extra list of parameters used by the generator, such as model attributes
 * @param {Object} [options] - Options passed over by commander including all set flags such --verbose
 * @param {Object} [leek] - If set this command is tracked to understand cli usage better
*/
module.exports = async function generate(blueprint, name, attributes, options, leek) {
  name = name || '';
  attributes = attributes || '';
  options = options || {};
  project = await Project.closest();
  addonBlueprints = project.getAddonBlueprints();

  if (typeof leek !== 'undefined') {
    trackCommand(`generate ${blueprint} ${name} ${attributes}`, {}, leek);
  }

  if (defaultBlueprints.indexOf(blueprint) > -1) {
    if (name !== undefined) {

      var prepEmberOptions = ['g', 'resource', name];

      if (options.pod) {
        prepEmberOptions.push('--pod');
      }

      var emberOptions = prepEmberOptions.concat(modelConversion.toEmber(attributes));
      var sailsOptions = ['generate', 'model', name].concat(modelConversion.toSails(attributes));

      spawn(ember, emberOptions, { cwd: clientName, stdio: 'inherit' });
      spawn(sails, sailsOptions, { cwd: serverName, stdio: 'inherit' });
      spawn(sails, ['generate', 'controller', name], { cwd: serverName, stdio: 'inherit' });

    } else {
      console.log(chalk.yellow('A resource/api name is required, e.g. sane g resource user'));
    }
  } else if(addonBlueprints.indexOf(blueprint) > -1) {
    var blueprintPath = project.getBlueprintPath(blueprint);
    var blueprint = require(blueprintPath);
    blueprint.client.exec({
      success: async function(actions) {
        //only install ember-addons addons if --skip-npm is not set
        if (!options.skipNpm) {
          for (var emberAddon of actions.addEmberAddons) {
            var addonSemVer = emberAddon.name + '@' + emberAddon.target
            var emberArgs = ['install:addon', addonSemVer]
            spawn('ember', emberArgs, { stdio: 'inherit', cwd: path.join(project.root, clientName) });
          }
        }

        for (var generate of actions.generates) {
          var emberArgs = ['generate', generate.type, generate.name, generate.parameters];
          spawn('ember', emberArgs, { stdio: 'inherit', cwd: path.join(project.root, clientName) });
        }

        //if addToConfig exists parse the ember-cli environment.js and add the new variables
        //to the end of the function just before the return ENV; statement
        //UNIT/ACCEPTANCE TEST THAT!
        if (actions.addToConfig) {
          var environmentPath = path.join(project.root, 'client', 'config', 'environment.js');
          var environment = fs.readFileSync(environmentPath, { encoding: 'utf8' });
          var endOfFunction = environment.indexOf('return ENV;');
          var addKeys = Object.keys(actions.addToConfig.ENV);

          var configToAddgString = '';
          for (var i = 0, len = addKeys.length; i < len; i++) {
            configToAddgString += `ENV[\'${addKeys[i]}\'] = ${JSON.stringify(actions.addToConfig.ENV[addKeys[i]], null, 2)};\n\n`;
          }

          var newEnvironment = environment.slice(0, endOfFunction) + configToAddgString + environment.slice(endOfFunction);

          fs.writeFileSync(environmentPath, newEnvironment);
        }
      }
    });

    blueprint.server.exec({
      success: function(actions) {
        var packageSemVers = [];
        for (var npmPackage of actions.addNpmPackages) {
          packageSemVers.push(npmPackage.name + '@' + npmPackage.target);
        }
        if (packageSemVers.length > 0) {

          var cmdPrefix = false;

          if (options.docker) {
            cmdPrefix = `${dockerCompose} run server`;
          }

          var installOptions = {
            dependencies: packageSemVers,
            // skip: options.skip,
            dryRun: options.skipNpm,
            save: true,
            // needed for optional docker
            cmdPrefix: cmdPrefix,
            // saves in the server file
            prefix: serverName
          };
          npmInstall(installOptions);
        }
      }
    });

    //now copy over templates
    var templates = getTemplates(path.join(blueprintPath, 'generate'));
    copyToProject(templates, project.root, options.force);

  } else {
    console.log(chalk.yellow('Blueprint ' + blueprint + ' is not supported'));
  }
};
