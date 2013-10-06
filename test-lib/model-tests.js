"use strict";

var should = require('should');
var _      = require('underscore');
var Q      = require('q');

function testReadOnlyObject(class_, model, raw) {
  
  describe('It should implement the "Object (read-only)" interface', function() {
  
    describe('#get()', function() {
      it ('should give access to all properties', function(done) {
        return Q.all( _.map(raw, function(refval, name) {
          return Q.when( model.get(name) )
            .then( function(value) { value.should.equal(refval) } )
        }))
        .then( function() { done() } )
      })
    })
  })
}

function testReadOnlyCollection(class_, model, reference) {
  
  describe('It should implement the "Collection (read-only)" interface', function() {
  
    describe('#each()', function() {
      
      it('should return a promise whose progress() method iterates over contained items', function(done) {
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



module.exports = {
  readOnlyObject: testReadOnlyObject,
  readOnlyCollection: testReadOnlyCollection /*,
  object: testObject,
  collection: testCollection */
}

//----------------------

function indexOfObject(items, values) {
  for (var i = 0; i < items.length; i ++) {
    if (_.isEqual(items[i], values)) return i;
  }
  return -1;
}