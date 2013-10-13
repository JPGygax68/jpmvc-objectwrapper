"use strict";

var _ = require('underscore');
var q = require('q');

var Wrapper = require('./wrapper');
var Object  = require('./object');
var cache   = require('./cache');

/* Collection implementation: ArrayWrapper */

function ArrayWrapper() {
  Wrapper.apply(this, arguments);
}

ArrayWrapper.prototype = new Wrapper();
ArrayWrapper.prototype.constructor = ArrayWrapper;

ArrayWrapper.prototype.isObject     = function() { return false; }
ArrayWrapper.prototype.isCollection = function() { return true; }

ArrayWrapper.prototype.each = function() {

  var def = q.defer();
  
  var that = this;
  setTimeout( function() {
    _.each(that.data, function(item, i) {
      def.notify(item);
    })
    def.resolve();  
  }, 0);
  
  return def.promise;
}

ArrayWrapper.prototype.addNewItem = function(init) {
  
  var def = q.defer();
  
  var item = _.clone(init);
  this.data.push(item);
  var wrapper = wrap(item, this);
  wrapper.container = this;
  
  // Add a remove() method
  wrapper.remove = function() {
    var def = q.defer();
    this.container._removingItem(this);
    def.resolve();
    return def.promise;
  }.bind(wrapper);
  
  // Override the dispose() method
  var orig_dispose = wrapper.dispose;
  wrapper.dispose = function() {
    var def = q.defer();
    //console.log('item wrapper dispose', this);
    this.container._removingItem(this);
    orig_dispose.call(this);
    def.resolve();
    return def.promise;
  }.bind(wrapper);
  
  _.each(this.insertion_callbacks, function(cb) { cb.call(this, wrapper) });
  
  def.resolve(wrapper);  
  return def.promise;
}

ArrayWrapper.prototype.itemAdded = function(cb) {
  if (!this.insertion_callbacks) this.insertion_callbacks = [];
  this.insertion_callbacks.push(cb);
}

ArrayWrapper.prototype.itemRemoved = function(cb) {
  if (!this.removal_callbacks) this.removal_callbacks = [];
  this.removal_callbacks.push(cb);
}

ArrayWrapper.prototype._removingItem = function(wrapper) {
  //console.log('_removingItem');
  if (this.removal_callbacks) {
    _.each(this.removal_callbacks, function(cb) {
      cb.call(this, wrapper);
    }, this)
  }
}

// Helper functions

function wrap(item, container) {
  var wrapper;
  if (_.isArray(item)) wrapper = cache.wrap(item, ArrayWrapper );
  else                 wrapper = cache.wrap(item, Object );
  wrapper.container = container;
  return wrapper;
}

// Module exports

module.exports = ArrayWrapper;
