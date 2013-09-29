"use strict";

var cache  = require('./cache');
var Model  = require('./model');

function wrap(data) {
  return cache.wrap(data, Model);
}

module.exports = {
  wrap: wrap
}