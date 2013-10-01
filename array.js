"use strict";

var _ = require('underscore');

var Wrapper = require('./wrapper');
var Object  = require('./object');
var cache   = require('./cache');

function wrap(item) {
  if (_.isArray(item)) return cache.wrap(item, ArrayWrapper );
  else                 return cache.wrap(item, Object);
}

function ArrayWrapper() {
  Wrapper.apply(this, arguments);
}

ArrayWrapper.prototype = new Wrapper();
ArrayWrapper.prototype.constructor = ArrayWrapper;

ArrayWrapper.prototype.isObject     = function() { return false; }
ArrayWrapper.prototype.isCollection = function() { return true; }

ArrayWrapper.prototype.forEachItem = function(cb) {
  _.each(this.data, function(item) { 
    cb.call(this, wrap(item));
  }, this)
}

ArrayWrapper.prototype.addNewItem = function(init) {
  var item = _.clone(init);
  this.data.push(item);
  var wrapper = wrap(item);
  _.each(this.insertion_callbacks, function(cb) { cb.call(this, wrapper) });
  return wrapper;
}

ArrayWrapper.prototype.itemInserted = function(cb) {
  if (!this.insertion_callbacks) this.insertion_callbacks = [];
  this.insertion_callbacks.push(cb);
}

module.exports = ArrayWrapper;
