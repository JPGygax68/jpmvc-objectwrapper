"use strict";

var should = require('should');
var _      = require('underscore');

var wrapper = require('../main');

var tests = require('../test-lib/model-tests');

describe('ObjectWrapper', function() {
  var obj = { firstname: 'Jean-Pierre', lastname: 'Gygax' };
  var model = wrapper.wrap(obj);
  tests.readOnlyObject('ObjectWrapper', model, { ref_object: obj } );
  tests.object('ObjectWrapper', model, { ref_object: obj } );
})

describe('ArrayWrapper', function() {
  var arr = [
    { firstname: 'Jean-Pierre', lastname: 'Gygax' },
    { name: 'Apollo 13', success: true, failure: true }
  ];
  var model = wrapper.wrap(arr);
  tests.readOnlyCollection('ArrayWrapper', model, { ref_items: arr } );
  
  var new_items = [ { firstname: 'Bugs', lastname: 'Bunny' }, { firstname: 'Daffy', lastname: 'Duck' } ];
  tests.collection('ArrayWrapper', model, { ref_items: arr, new_items: new_items } );
})