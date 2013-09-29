"use strict";

var _ = require('underscore');

var cache = require('./cache');

function Model(data, index) {
  this.data = data;
  this.index = index;
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

Model.prototype.forEachItem = function(cb) {
  _.each(this.data, function(item) { 
    var model = cache.wrap(item, Model);
    cb.call(this, model);
  }, this)
}

Model.prototype.change = function(cb) {
  if (!this.change_callbacks) this.change_callbacks = [];
  this.change_callbacks.push(cb);
}

Model.prototype.dispose = function() {
  this.data = null;
  delete cache[this.index];
}

module.exports = Model;
