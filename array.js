"use strict";

var _ = require('underscore');

var Wrapper = require('./wrapper');
var Object  = require('./object');
var cache   = require('./cache');

function Array() {
  Wrapper.apply(this, arguments);
}

Array.wrap = function(data) {
}

Array.prototype = new Wrapper();
Array.prototype.constructor = Array;

Array.prototype.isObject     = function() { return false; }
Array.prototype.isCollection = function() { return true; }

Array.prototype.forEachItem = function(cb) {
  _.each(this.data, function(item) { 
    var model;
    if (_.isArray(item)) model = cache.wrap(item, Array );
    else                 model = cache.wrap(item, Object);
    cb.call(this, model);
  }, this)
}

module.exports = Array;