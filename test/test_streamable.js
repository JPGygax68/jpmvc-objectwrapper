"use strict";

var should = require('should');

var qfs  = require('q-io/fs');
var path = require('path');
var jDataView = require('jdataview');

function testReadOnlyStreamable(class_, obj) {

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
    
      describe('object returned by #open():', function() {
      
        describe('#forEach():', function() {
        
          it('must correctly read binary data', function(done) {
            var buffer = new jDataView(128*1024);
            var bytes = 0;
            return obj.open('rb')
              .then( function(reader) {
                return reader.forEach( function writer(chunk, thisp) {
                  buffer.writeBytes(chunk);
                  bytes += chunk.length;
                })
              })
              .then( function() { bytes.should.equal(123405) } )
              .done( function() { done() } )
          })
        })
      })
    })
  })
}

var str_obj = {

  open: function(options) {
    return qfs.open(path.join(__dirname, 'data/350r.jpg'), options);
  }
  
};

testReadOnlyStreamable('TestClass', str_obj);