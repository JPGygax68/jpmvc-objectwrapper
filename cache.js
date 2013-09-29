"use strict";

var _ = require('underscore');

var Wrapper = require('./wrapper');

var cache = [];

Wrapper.registerDisposeCallback( function(model, index) { delete cache[index] } );

function wrap(data, Wrapper) {

  // Wrapper already exists ?
  var wrapper = _.findWhere(cache, { data: data });  
  if (wrapper) {
    return wrapper;
  }
  else {
    // Reusable slot in cache ?
    for (var index = 0; index < cache.length; index ++) {
      if (!cache[index].data) {
        wrapper = new Wrapper(data, index);
        cache[index] = wrapper;
        return wrapper;
      }
    }
    // No reusable slot
    wrapper = new Wrapper(data, cache.length);
    cache.push(wrapper);
    return wrapper;
  }
}

module.exports = {
  wrap: wrap
}