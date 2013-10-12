"use strict";

var should = require('should');
var _      = require('underscore');
var Q      = require('q');

function testReadOnlyObject(class_, model, reference) {
  
  describe('It must implement the "Object (read-only)" interface', function() {
  
    describe('#get()', function() {
      it ('must give access to all properties', function(done) {
        Q.all( _.map(reference, function(refval, name) {
          return Q.when( model.get(name) )
            .then( function(value) { value.should.equal(refval) } )
        }))
        .done( function() { done() } )
      })
    })
  })
}

function testReadOnlyCollection(class_, model, reference) {
  
  describe('It must implement the "Collection (read-only)" interface', function() {
  
    describe('#each()', function() {
      
      it('must return a promise whose progress() method iterates over contained items', function(done) {
        var used = []; // "tick off" list
        var remaining = reference.length;
        
        model.each().progress( function(item) {
          var i = indexOfObject(reference, item);
          if (i < 0) throw new Error('progress() returns item not present in reference array');
          if (used[i]) throw new Error('same object found again in reference array');
          used[i] = true;
          remaining --;
          if (remaining === 0) done();
        })
      })
      
    })
  })
}

function testObject(class_, model, reference) {

  describe('It must implement the "Object" interface', function() {
  
    describe('#set()', function() {
    
      it('must allow properties to be modified', function(done) {
        var count = 0;
        Q.all( _.map(reference, function(curval, name) {
          var oldval = curval;
          return Q.when( model.get(name) )
            .then( function(value)  { return model.set(name, value + value) } )
            .then( function()       { return model.get(name) } )
            .then( function(newval) { newval.should.equal(oldval+oldval) } )
            .then( function()       { count ++ } )
        }) )
        .done( function() { 
          if (count === 0) throw new Error('test failed because no reference object has no properties?');
          done();
        })
      })
    })
  })
}

module.exports = {
  readOnlyObject: testReadOnlyObject,
  readOnlyCollection: testReadOnlyCollection,
  object: testObject /*,
  collection: testCollection */
}

//----------------------

function indexOfObject(items, values) {
  for (var i = 0; i < items.length; i ++) {
    if (_.isEqual(items[i], values)) return i;
  }
  return -1;
}