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
  if (value !== this.data[key]) {
    this.data[key] = value;
    _.each(this.change_callbacks, function(cb) { cb.call(this, value) }, this);
  }
  return this.data[key];
}

Model.prototype.isObject = function() {
  return _.isObject(this.data) && !_.isArray(this.data);
}

Model.prototype.isCollection = function() {
  return _.isArray(this.data);
}

Model.prototype.getKeys = function() {
  return _.keys(this.data);
}

Model.prototype.change = function(cb) {
  if (!this.change_callbacks) this.change_callbacks = [];
  this.change_callbacks.push(cb);
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