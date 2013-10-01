"use strict";

var _ = require('underscore');
var Q = require('q');

var Wrapper = require('./wrapper');

function ObjectWrapper() {
  Wrapper.apply(this, arguments);
}

ObjectWrapper.prototype = new Wrapper();
ObjectWrapper.prototype.constructor = ObjectWrapper;

ObjectWrapper.prototype.isObject     = function() { return true; }
ObjectWrapper.prototype.isCollection = function() { return false; }

ObjectWrapper.prototype.getPropertyNames = function() {
  return _.keys(this.data);
}

ObjectWrapper.prototype.get = function(key) {
  var def = Q.defer();
  def.resolve(this.data[key]);
  return def.promise;
}

ObjectWrapper.prototype.set = function(key, value) {
  if (value !== this.data[key]) {
    this.data[key] = value;
    _.each(this.change_callbacks, function(cb) { cb.call(this, value) }, this);
  }
  return this.data[key];
}

ObjectWrapper.prototype.propertyChanged = function(cb) {
  if (!this.change_callbacks) this.change_callbacks = [];
  this.change_callbacks.push(cb);
}

module.exports = ObjectWrapper;
