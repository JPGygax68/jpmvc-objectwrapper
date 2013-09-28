"use strict";

var _ = require('underscore');

var cache = [];

function Model(data) {
  this.data = data;
}

Model.prototype.get = function(key) {
  return this.data[key];
}

Model.prototype.set = function(key, value) {
  return (this.data[key] = value);
}

Model.prototype.isObject = function() {
  return _.isObject(this.data) && !_.isArray(this.data);
}

Model.prototype.isCollection = function() {
  return _.isArray(this.data);
}

function wrap(data) {

  var wrapper = _.findWhere(cache, { data: data });
  
  if (!wrapper) {
    wrapper = new Model(data);
    cache.push(wrapper);
  }
  
  return wrapper;
}

module.exports = {
  wrap:                     wrap
}