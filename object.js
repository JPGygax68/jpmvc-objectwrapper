"use strict";

var _ = require('underscore');
var q = require('q');

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
  var def = q.defer();
  var self = this;
  if (this.data[key] instanceof Uint8Array) {
    def.resolve( {    
      open: function(options) {
        var def = q.defer();
        var flags;
        if (typeof options === 'string') flags = options;
        else {
          options = options || {};
          flags = options.flags;
        }
        def.resolve( {
          forEach: function(writer) { writer(this.data[key]); }
        })
        return def.promise;
      },
      
      read: function() {
        var ref = q.defer();
        ref.resolve( self.data[key] );
        return ref.promise;
      }
    })
  }
  else {
    def.resolve(this.data[key]);
  }
  return def.promise;
}

ObjectWrapper.prototype.set = function(key, value) {
  if (value !== this.data[key]) {
    this.data[key] = value;
    _.each(this.change_callbacks, function(cb) { cb.call(this, value) }, this);
  }
  return this.data[key];
}

ObjectWrapper.prototype.getAll = function() {
  var def = q.defer();
  def.resolve( _.clone(this.data) );
  return def.promise;
}

ObjectWrapper.prototype.propertyChanged = function(cb) {
  if (!this.change_callbacks) this.change_callbacks = [];
  this.change_callbacks.push(cb);
}

ObjectWrapper.prototype.deleted = function(cb) {
  if (!this.deletion_callbacks) this.deletion_callbacks = [];
  this.deletion_callbacks.push(cb);
}

ObjectWrapper.prototype.dispose = function() {
  var def = q.defer();
  Wrapper.prototype.dispose.call(this);
  _.each(this.deletion_callbacks, function(cb) { cb.call(this) }, this);
  def.resolve();
  return def.promise;
}

module.exports = ObjectWrapper;
