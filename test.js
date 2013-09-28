"use strict";

var should = require('should');

var wrapper = require('./main');

( !! wrapper.wrap({}) ).should.be.ok;