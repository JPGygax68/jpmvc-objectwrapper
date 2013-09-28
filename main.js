"use strict";

var _ = require('underscore');

var cache = [];

function Model(object) {
  this.object = object;
}

Model.prototype.get = function(key) {
  return this.object[key];
}

Model.prototype.set = function(key, value) {
  return (this.object[key] = value);
}

function wrap(object) {

  var wrapper = _.findWhere(cache, { object: object });
  
  if (!wrapper) {
    wrapper = new Model(object);
    cache.push(wrapper)
  }
  
  return wrapper;
}

module.exports = {
  wrap:                     wrap
}