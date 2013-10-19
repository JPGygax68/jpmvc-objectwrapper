"use strict";

var should = require('should');
var _      = require('underscore');

var wrapper = require('../main');

var tests = require('../test-lib/model-tests');

describe('ObjectWrapper', function() {
  var obj = { firstname: 'Jean-Pierre', lastname: 'Gygax', picture: new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) };
  var model = wrapper.wrap(obj);
  tests.readOnlyObject('ObjectWrapper', model, { 
    ref_object: obj,
    streamables: [ { name: 'picture', content: obj.picture } ]
  } );
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