"use strict";

var _ = require('underscore');

var Object = require('./object');
var Array  = require('./array');

function wrap(data) {
  var wrapper;
  if (_.isArray(data)) wrapper = new Array(data);
  else                 wrapper = new Object(data);
  return wrapper;
}

module.exports = {
  wrap: wrap
}