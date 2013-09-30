"use strict";

var _ = require('underscore');

var Wrapper = require('./wrapper');

function Object() {
  Wrapper.apply(this, arguments);
}

Object.prototype = new Wrapper();
Object.prototype.constructor = Object;

Object.prototype.isObject     = function() { return true; }
Object.prototype.isCollection = function() { return false; }

Object.prototype.getPropertyNames = function() {
  return _.keys(this.data);
}

Object.prototype.get = function(key) {
  return this.data[key];
}

Object.prototype.set = function(key, value) {
  if (value !== this.data[key]) {
    this.data[key] = value;
    _.each(this.change_callbacks, function(cb) { cb.call(this, value) }, this);
  }
  return this.data[key];
}

Object.prototype.propertyChanged = function(cb) {
  if (!this.change_callbacks) this.change_callbacks = [];
  this.change_callbacks.push(cb);
}

module.exports = Object;
