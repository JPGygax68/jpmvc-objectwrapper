"use strict";

var _ = require('underscore');

var cache = [];

function Model(object) {
  this.object = object;
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