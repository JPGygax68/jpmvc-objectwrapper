"use strict";

var _ = require('underscore');

var cache = [];
var dispose_callback;

function Wrapper(data, index) {
  //console.log('Wrapper()', data, index);
  this.data = data;
  this.index = index;
}

Wrapper.registerDisposeCallback = function(cb) {
  if (dispose_callback) throw new Error('dispose callback already registered');
  dispose_callback = cb;
}

Wrapper.prototype.dispose = function() {
  dispose_callback(this, this.extra);
  this.data = null;
}

module.exports = Wrapper;
