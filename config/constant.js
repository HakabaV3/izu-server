var express = require('express'),
  constant = {};

const SERVER_PROTOCOL = 'http',
  SERVER_HOST = express().get('env') == 'development' ? 'localhost:3000' : 'izu.hakaba.xyz';

constant.serverUrl = function() {
  return SERVER_PROTOCOL + '://' + SERVER_HOST;
};

constant.serverUrlWithPath = function(path) {
  if (path.charAt(0) == '/') {
    return this.serverUrl() + path;
  }
  return this.serverUrl() + '/' + path;
};

module.exports = constant;
