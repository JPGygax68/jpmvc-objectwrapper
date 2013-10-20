"use strict";

var should = require('should');
var _      = require('underscore');

var wrapper = require('../main');

var tests = require('../test-lib/model-tests');

//--- Utilities -----------------------

function clone(val) {
  if (typeof val === 'object') {
    if (val instanceof Uint8Array) return new Uint8Array(val); // TODO: other ArrayBuffer views
    else if (val instanceof Array) return val.slice(0);
    else {
      var dup = {};
      for (var name in val) dup[name] = clone(val[name]);
      return dup;
    }
  }
  else {
    return val;
  }
}

//--- Tests ---------------------------

describe('ObjectWrapper', function() {
  var obj = { firstname: 'Jean-Pierre', lastname: 'Gygax', picture: new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) };
  var ref = clone(obj);
  var model = wrapper.wrap(obj);
  tests.readOnlyObject('ObjectWrapper', model, { ref_object: ref } );
  tests.object('ObjectWrapper', model, { ref_object: ref } );
})

describe('ArrayWrapper', function() {
  var arr = [
    { firstname: 'Jean-Pierre', lastname: 'Gygax' },
    { name: 'Apollo 13', success: true, failure: true }
  ];
  var ref = clone(arr);
  var model = wrapper.wrap(arr);
  tests.readOnlyCollection('ArrayWrapper', model, { ref_items: ref } );
  
  var new_items = [ { firstname: 'Bugs', lastname: 'Bunny' }, { firstname: 'Daffy', lastname: 'Duck' } ];
  tests.collection('ArrayWrapper', model, { ref_items: ref, new_items: new_items } );
})