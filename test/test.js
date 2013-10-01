"use strict";

var should = require('should');
var _      = require('underscore');

var wrapper = require('../main');

var tests = require('../test-lib/model-tests');

var obj     = { firstname: 'Jean-Pierre', lastname: 'Gygax' };
var wrapper = wrapper.wrap(obj);

tests.readOnlyObject('ObjectWrapper', wrapper, obj);