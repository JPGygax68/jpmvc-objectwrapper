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

  var obj1 = { firstname: 'Jean-Pierre', lastname: 'Gygax' };
  var model = wrapper.wrap(obj1);

  describe('#get()', function() {
    it('Should return a property', function() {
      model.get('firstname').should.be.equal('Jean-Pierre');
    })
  })

  describe('#set()', function() {
    it('Should modify a property and return it', function() {
      model.set('firstname', 'Hans-Peter').should.be.equal('Hans-Peter');
    })
  })

  describe('#isObject()', function() {
    it('Should return true for a wrapped object', function() {
      model.isObject().should.be.true;
    })
  })
  
  describe('#isCollection()', function() {
    it('Should return true for a wrapped array', function() {
      model.isCollection().should.be.false;
    })
  })
})

//-------------------------------------
// Notifications

describe('Notifications', function() {
})