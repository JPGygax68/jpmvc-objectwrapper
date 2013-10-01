"use strict";

var should = require('should');
var _      = require('underscore');
var Q      = require('q');

function testReadOnlyObject(class_, model, raw) {
  
  describe(class_+' should implement the "Object (read-only)" interface', function() {
    it(class_+'#get() should give access to all properties', function(done) {
      return Q.all( _.map(raw, function(refval, name) {
        //return object.get(name)
        return Q.when(model.get(name))
          .then( function(value) { value.should.equal(refval) } )
      })).then( function() { done() } );
    })
  })
}



module.exports = {
  readOnlyObject: testReadOnlyObject /*,
  readOnlyCollection: testReadOnlyCollection,
  object: testObject,
  collection: testCollection */
}