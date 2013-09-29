"use strict";

var should = require('should');
var _      = require('underscore');

var wrapper = require('./main');

describe('Model basics', function() {

  describe('#wrap()', function() {
    it('Should return an object', function() {
      ( !! wrapper.wrap({}) ).should.be.ok;
    })
  })

  var obj = { firstname: 'Jean-Pierre', lastname: 'Gygax' };
  var objmod = wrapper.wrap(obj);
  
  var arr = [ {name: 'Item 1'}, {name: 'Item 2'} ];
  var arrmod = wrapper.wrap(arr);

  describe('#get()', function() {
    it('Should return a property', function() {
      objmod.get('firstname').should.be.equal('Jean-Pierre');
    })
  })

  describe('#set()', function() {
    it('Should modify a property and return it', function() {
      objmod.set('firstname', 'Hans-Peter').should.equal('Hans-Peter');
    })
  })

  describe('#isObject()', function() {
    it('Should return true for a wrapped object', function() {
      objmod.isObject().should.be.true;
    })
    it('Should return false for a wrapped array', function() {
      arrmod.isObject().should.be.false;
    })
  })
  
  describe('#isCollection()', function() {
    it('Should return true for a wrapped array', function() {
      arrmod.isCollection().should.be.true;
    })
    it('Should return false for a wrapped object', function() {
      objmod.isCollection().should.be.false;
    })
  })
  
  describe('#getPropertyNames()', function() {
    it('Should return the names of all properties of a wrapped object', function() {
      var names = objmod.getPropertyNames();
      _.difference(names, ['firstname', 'lastname']).length.should.equal(0);
    })
  })
  
  describe('#forEachItem()', function() {
    it('Should call callback function for each item', function() {
      var item_names = []
      arrmod.forEachItem( function(item) {
        item_names.push(item.get('name'));
      })
      item_names.length.should.equal(2);
      item_names[0].should.equal('Item 1');
      item_names[1].should.equal('Item 2');
    })
  })
  
  describe('#dispose()', function() {
    it('Should cause subsequent get()s or set()s to throw an exception', function() {
      objmod.dispose();
      (function() { objmod.get('firstname') }).should.throw();
    })
  })
})

describe('Notifications', function() {

  var obj = { firstname: 'Jean-Pierre', lastname: 'Gygax' };
  var objmod = wrapper.wrap(obj);
  
  describe('#change()', function() {
    it('Should be called when a member is set()', function() {
      objmod.set('firstname', 'Jean-Pierre');
      var triggered = false;
      objmod.change( function() { triggered = true } );
      objmod.set('firstname', 'Hans-Peter');
      triggered.should.be.true;
    })
    it('Triggers multiple callbacks', function() {
      objmod.set('firstname', 'Jean-Pierre');
      var triggered1 = false, triggered2 = false;
      objmod.change( function() { triggered1 = true } );
      objmod.change( function() { triggered2 = true } );
      objmod.set('firstname', 'Hans-Peter');
      (triggered1 && triggered2).should.be.true;
    })
  })
})
