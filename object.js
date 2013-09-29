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

module.exports = Object;
