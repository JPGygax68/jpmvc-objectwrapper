"use strict";

var should = require('should');

var wrapper = require('./main');

//-------------------------------------
// BASICS

describe('Model', function() {

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
      objmod.set('firstname', 'Hans-Peter').should.be.equal('Hans-Peter');
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
})

//-------------------------------------
// Notifications

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