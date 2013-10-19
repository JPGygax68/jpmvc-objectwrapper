"use strict";

var should = require('should');
var _      = require('underscore');
var q      = require('q');

var streamable = require('./streamable');

// Helper functions -------------------

function checkObjectModelAgainstReference(model, reference) {

  return q.all( _.map(_.clone(reference), function(refval, name) {
    return q.when( model.get(name) )
      .then( function(value) { value.should.equal(refval) } )
  }))
}

function checkCollectionModelAgainstReference(model, reference) {
  // TODO
}

// Main functions -------------------------------

function testReadOnlyObject(class_, model, options) {
  
  var reference = options.ref_object;
  var streamables = options.streamables;
  
  describe('must implement the "Object (read-only)" interface', function() {
  
    describe('#get()', function() {
      it('must give access to all properties', function(done) {
        checkObjectModelAgainstReference(model, reference)
        .done( function() { done() } )
      })
    })
    
    describe('#getAll()', function() {
      // TODO: whether getAll() should be recursive is not yet defined
      it('must get all properties into a JS object', function(done) {
        model.getAll()
          .then( function(obj) { _.isEqual(obj, reference).should.be.ok } )
          .done( function() { done() } ); 
      })
    })
    
    if (streamables) {
      
      describe('#get() of a "readable" (read-only streamable) field', function() {
        describe('object returned by #get() must implement "Readable" interface', function() {
          q.all( _.map(streamables, function(descr) {
            return model.get(descr.name)
              .then( function(field) { streamable.testReadOnlyStreamable(class_, field, descr.content) } )
          }) )
          .done( function() { done() } )
        })
      })
    
    } // if streamables
  
  })
}

function testObject(class_, model, options) {

  var reference = options.ref_object;

  describe('It must implement the "Object" interface', function() {
  
    describe('#set()', function() {
    
      it('must allow properties to be modified', function(done) {
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
    
      it('must trigger a deleted() callback event', function(done) {
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

//--- COLLECTIONS ---------------------

function testReadOnlyCollection(class_, model, options) {

  var reference = options.ref_items;

  describe('It must implement the "Collection (read-only)" interface:', function() {
  
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
    
    describe('#find()', function() {
    
      it('must find a contained item by its properties', function(done) {
        q.all( _.map( reference, function(refobj) {          
          return model.find( _.clone(refobj) )
            .then( function(item) { 
              return item.getAll()
                .then( function(obj) { _.isEqual(obj, refobj).should.be.true } )
            })
        }))
        .done( function() { done() } )
      })
    })
    
    describe('#count()', function() {
      it('must return the number of items in the collection', function(done) {
        model.count()
          .then( function(n) { 
            n.should.equal(reference.length)
          })
          .done( function() { done() } )
      })
    })
    
  })
}

function testCollection(class_, model, options) {

  var original_item_refs = options.ref_items;
  var new_item_refs = options.new_items;

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
    
    describe('item#remove()', function() {
    
      it('must remove the item from the collection, triggering itemRemoved()', function(done) {
        var initial_count;
        model.count()
          .then( function(n) { initial_count = n } )
          .then( function()  { return model.addNewItem( _.clone(new_item_refs[0]) ) } )
          .then( function(new_item) {        
            var triggered = false;
            model.itemRemoved( function(item) { triggered = true } );
            new_item.remove()
              .then( function(wrapper) { 
                triggered.should.be.true;              
                return checkObjectModelAgainstReference(wrapper, new_item_refs[0]);
              })
              .then( function() {
                return model.count().then( function(n) { n.should.equal(initial_count) } )
              })
              .done( function() { done() } )
          })
          .done();
      })
    })
    
    describe('item#dispose()', function() {
    
      it('must remove the item and delete it (trigger itemRemoved() on the collection, deleted() on the item)', function(done) {
        model.addNewItem( _.clone(new_item_refs[0]) )
          .then( function(new_item) {        
            var removed = false;
            var deleted = false;
            new_item.deleted( function() { deleted = true } );
            model.itemRemoved( function(item) { removed = true } );
            new_item.dispose()
              .then( function() { 
                removed.should.be.true;
                deleted.should.be.true;
              })
              .done( function() { done() } )
          })
          .done();
      })
    })
  })
}

//--- MODULE EXPORTS ----------------------------

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