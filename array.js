"use strict";

var _ = require('underscore');

var Wrapper = require('./wrapper');
var Object  = require('./object');
var cache   = require('./cache');

function wrap(item) {
  if (_.isArray(item)) return cache.wrap(item, Array );
  else                 return cache.wrap(item, Object);
}

function Array() {
  Wrapper.apply(this, arguments);
}

Array.prototype = new Wrapper();
Array.prototype.constructor = Array;

Array.prototype.isObject     = function() { return false; }
Array.prototype.isCollection = function() { return true; }

Array.prototype.forEachItem = function(cb) {
  _.each(this.data, function(item) { 
    cb.call(this, wrap(item));
  }, this)
}

Array.prototype.addNewItem = function(init) {
  var item = _.clone(init);
  this.data.push(item);
  return wrap(item);
}

module.exports = Array;