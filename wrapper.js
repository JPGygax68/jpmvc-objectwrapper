"use strict";

var _ = require('underscore');

var cache = [];
var dispose_callback;

function Wrapper(data, index) {
  this.data = data;
  this.index = index;
}

Wrapper.registerDisposeCallback = function(cb) {
  if (dispose_callback) throw new Error('dispose callback already registered');
  dispose_callback = cb;
}

Wrapper.prototype.get = function(key) {
  return this.data[key];
}

Wrapper.prototype.set = function(key, value) {
  if (value !== this.data[key]) {
    this.data[key] = value;
    _.each(this.change_callbacks, function(cb) { cb.call(this, value) }, this);
  }
  return this.data[key];
}

Wrapper.prototype.change = function(cb) {
  if (!this.change_callbacks) this.change_callbacks = [];
  this.change_callbacks.push(cb);
}

Wrapper.prototype.dispose = function() {
  dispose_callback(this, this.extra);
  this.data = null;
}

module.exports = Wrapper;
