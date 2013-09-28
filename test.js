"use strict";

var should = require('should');

var wrapper = require('./main');

( !! wrapper.wrap({}) ).should.be.ok;

var obj1 = { firstname: 'Jean-Pierre', lastname: 'Gygax' };

var model = wrapper.wrap(obj1);

model.get('firstname').should.be.equal('Jean-Pierre');

model.set('firstname', 'Hans-Peter').should.be.equal('Hans-Peter');