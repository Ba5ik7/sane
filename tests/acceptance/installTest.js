/*jshint quotmark: false*/
'use strict';

var assertFileEquals  = require('../helpers/assertFileEquals');
var assertFile        = require('../helpers/assertFile');
var fs                = require('fs-extra');
var path              = require('path');
var tmp               = require('tmp-sync');
require('shelljs/global');
var { execFile }      = require('child-process-promise');
var { initApp, sane, root, tmproot } = require('../helpers/acceptanceSetup');
// var EOL              = require('os').EOL;
// var BlueprintNpmTask = require('../helpers/disable-npm-on-blueprint');


describe('Acceptance: sane install', function() {
  var tmpdir;

//   before(function() {
//     BlueprintNpmTask.disableNPM();
//     conf.setup();
//   });

//   after(function() {
//     BlueprintNpmTask.restoreNPM();
//     conf.restore();
//   });

  beforeEach(function() {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  afterEach(function() {
    process.chdir(root);
    fs.removeSync(tmproot);
  });

  async function install(args) {
    var generateArgs = ['install'].concat(args.split(' '));

    await initApp();

    return execFile(sane, generateArgs);
  }

  it('sane-auth installs rund generator', async function() {
    await install('sane-auth');

    //checks that addon has been installed
    assertFile(path.join('node_modules', 'sane-auth', 'package.json'));
    //check that it also got save-deved
    assertFile('package.json', {
      contains: [
        'devDependencies',
        '"sane-auth": '
      ]
    });

    //checks that templates have been copied over properly from the generator
    assertFile(path.join('server', 'api', 'policies', 'hasToken.js'));
    assertFile(path.join('client', 'node_modules', 'ember-cli-simple-auth', 'package.json'));
  });

});
