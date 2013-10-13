"use strict";

var should = require('should');
var _      = require('underscore');
var q      = require('q');

function checkObjectModelAgainstReference(model, reference) {

  return q.all( _.map(_.clone(reference), function(refval, name) {
    return q.when( model.get(name) )
      .then( function(value) { value.should.equal(refval) } )
  }))
}

function testReadOnlyObject(class_, model, reference) {
  
  describe('It must implement the "Object (read-only)" interface', function() {
  
    describe('#get()', function() {
      it ('must give access to all properties', function(done) {
        checkObjectModelAgainstReference(model, reference)
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
    
      it('Must allow properties to be modified', function(done) {
        var count = 0;
        q.all( _.map(reference, function(curval, name) {
          var oldval = curval;
          return q.when( model.get(name) )
            .then( function(value)  { return model.set(name, value + value) } )
            .then( function()       { return model.get(name) } )
            .then( function(newval) { newval.should.equal(oldval+oldval) } )
            .then( function()       { count ++ } )
        }) )
        .done( function() { 
          if (count === 0) throw new Error('test failed because reference object has no properties?');
          done();
        })
      })
    })
    
    describe('#dispose()', function() {
    
      it('Must trigger a deleted() callback event', function(done) {
        var triggered;
        model.deleted( function() { triggered = true } );
        model.dispose()
        .then( function() {
          triggered.should.be.ok;
        })
        .done( function() { done() } )
      })
    })
  })
}

function testCollection(class_, model, new_item_refs) {

  describe('must implement the "Collection" interface:', function() {
  
    describe('#addNewItem()', function() {
    
      it('must add new item containing at least the values passed as parameter object', function(done) {
        q.all( _.map(new_item_refs, function(new_item_ref) {
          return model.addNewItem( _.clone(new_item_ref) )
            .then( function(new_item) {
              return q.all( _.map(new_item_ref, function(refval, name) { 
                return new_item.get(name).then( function(value) { value.should.equal(refval); } )
              }) )
            })
        }) )
        .then( function() { done() })
      })
      
      it('must trigger itemAdded() callback event', function(done) {
        var new_item = null;
        model.itemAdded( function(item) { new_item = item } );
        model.addNewItem( _.clone(new_item_refs[0]) )
          .then( function(item) { 
            new_item.should.be.ok;
            checkObjectModelAgainstReference(item, new_item_refs[0]);
          } )
          .done( done.bind() )
      })
    })
    
    describe('item#dispose()', function() {
    
      model.addNewItem( _.clone(new_item_refs[0]) )
      .then( function(new_item) {
        
        it('must trigger itemRemoved() on containing Collection', function(done) {
          var triggered = false;
          model.itemRemoved( function(item) { triggered = true } );
          new_item.dispose()
          .then( function() { triggered.should.be.ok } )
          .done( function() { done() } )
        })
      })
      .done();
    })
  })
}

module.exports = {
  readOnlyObject: testReadOnlyObject,
  readOnlyCollection: testReadOnlyCollection,
  object: testObject,
  collection: testCollection
}

//----------------------

function indexOfObject(items, values) {
  for (var i = 0; i < items.length; i ++) {
    if (_.isEqual(items[i], values)) return i;
  }
  return -1;
}