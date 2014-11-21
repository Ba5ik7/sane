/*
 * Check things like DOCKER_HOST is set, docker/boot2docker/fig (depending on OS), sails and/or ember installed
 * Also used to return the right docker IP if used
 */
require('shelljs/global');

var self = {
  /*
   *  OSX and windows need boot2docker installed. Other Unix systems do not.
   * process.platform can return: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
   */
  dockerExists: function(){
    if (!which('fig') || !which('docker')) {
      return false;
    }
    //check for windows or Mac OSX
    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      if (!which('boot2docker')) {
        return false;
      }
    }
    return true;
  },
  dockerRunning: function() {
    if (exec('docker info').code !== 0) {
      return false;
    }

    if (['win32', 'darwin'].indexOf(process.platform) > -1) {
      if (exec('boot2docker info').code !== 0) {
        return false;
      }
    }
    return true;
  }
  emberExists: function() {
    if (!which('ember')) {
      return false;
    }
    return true;
  },
  sailsExists: function() {
    if (!which('sails')) {
      return false;
    }
    return true;
  },
  dockerIp: function() {
    if( self.dockerExists() && self.dockerRunning() ) {
      var ip = process.env.DOCKER_HOST;
      //expects DOCKER_HOST to be of format: 'tcp://0.0.0.0:0'
      ip = ip.slice(ip.lastIndexOf('/') + 1, ip.lastIndexOf(':'));
      //simple check for valid ip
      if (ip.length > 6) {
        return ip;
      }
    }
    return null;
  }
};

module.exports = self;