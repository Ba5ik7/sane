'use strict';

var path       = require('path');
// var rimraf     = require('fs-extra').remove;
// var tmp        = require('tmp-sync');
// var assert     = require('../helpers/assert');

// var assert = require('chai').assert in ES6-style:
var {assert} = require('chai');
// var runCommand = require('../helpers/runCommand');
var version = require('../../package.json').version;
var {execFile} = require('child-process-promise');

var root       = process.cwd();
// var tmproot    = path.join(root, 'tmp');
var sane       = path.join(root, 'bin', 'sane');
// var tmpdir;

describe('Acceptance: sane help', function() {
  // beforeEach(function() {
  //   tmpdir = tmp.in(tmproot);
  //   process.chdir(tmpdir);
  // });

  // afterEach(function(done) {
  //   process.chdir(root);
  //   rimraf(tmproot, done);
  // });

  it('displays commands, it\'s aliases and the correct cli version', async function() {
    var output;
    var args = ['help'];
    if (process.platform === 'win32') {
      output = await exec(`'${process.execPath}' ${sane} ${args.join(" ")}`);
    } else {
      output = await execFile(sane, args);
    }

    output = output.stdout;

    assert.include(output, 'new|n');
    assert.include(output, 'up|serve');
    assert.include(output, 'generate|g');
    assert.include(output, 'version: ' + version);
  });
});
