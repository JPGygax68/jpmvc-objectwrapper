"use strict";

// TODO: move this to test-lib

var should = require('should');

var fs        = require('fs');
var q         = require('q');
var qfs       = require('q-io/fs');
var path      = require('path');
var jDataView = require('jdataview');

function testReadOnlyStreamable(class_, obj, content_ref) {

  describe('The object must implement the read-only parts of the "Streamable" interface:', function() {
  
    describe('#open()', function() {
      
      it('must return a promise for a functioning "Reader"-compatible object', function(done) {
        obj.open('rb')
          .then( function(reader) {
            reader.forEach.should.be.function;
            reader.read.should.be.function;
          })
          .done( function() { done() } )
      })
    
      describe('Object returned (promised) by #open() (with option string "rb"):', function() {
      
        describe('#forEach():', function() {
        
          it('must correctly read binary data', function(done) {
            var buffer = new Uint8Array(content_ref.length);
            var bytes = 0;
            return obj.open('rb')
              .then( function(reader) {
                return reader.forEach( function writer(chunk, thisp) {
                  for (var i = 0; i < chunk.length ; i ++) buffer[bytes+i] = chunk[i];
                  bytes += chunk.length;
                })
              })
              .then( function() { 
                bytes.should.equal(content_ref.length);
                for (var i = 0; i < bytes; i++) buffer[i].should.equal(content_ref[i]);
              })
              .done( function() { done() } )
          })
        })        
      })
      
    }) // #open()
    
    describe('#read():', function() {
    
      it('must return (through promise) the whole content as a buffer (when called with option "b")', function(done) {
        return obj.read('b')
          .then( function(content) {
            content.length.should.equal(content_ref.length);
            for (var i = 0; i < content.length; i++) content[i].should.equal(content_ref[i]);
          })
          .done( function() { done() } )
      })
      
    }) // #read()
    
  })  
}

function testStreamable(class_, obj, content_ref) {
}

//-------------------------------------

/** The following is a meta-test: it tests the test suite using a mocked-up Streamable object.
    This meta-test will be executed automatically whenever this module is require'd.
 */

describe('Testing the test function for read-only Streamables using a mocked-up object:', function(done) {

  var str_obj = {
    open: function(options) {
      return qfs.open(path.join(__dirname, 'data/350r.jpg'), options);
    },
    
    read: function(options) {
      return qfs.read(path.join(__dirname, 'data/350r.jpg'), options);
    }
  };

  var content = fs.readFileSync(path.join(__dirname, 'data/350r.jpg'));
  
  //console.log(content);
  testReadOnlyStreamable('TestClass', str_obj, content);
})

//--- MODULE EXPORTS ------------------

module.exports = {
  testReadOnlyStreamable: testReadOnlyStreamable,
  testStreamable: testStreamable
}
