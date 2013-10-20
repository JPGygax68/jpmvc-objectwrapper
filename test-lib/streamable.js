"use strict";

/*  NOTE: this test module is not currently in use. As of 2013-10-20, I have abandoned the idea of
    wrapping binary or big objects in streams.
    The Streamable interface/concept might still be used in the future, perhaps as an extension to
    the minimal specification.
 */
 
var should = require('should');

var fs        = require('fs');
var q         = require('q');
var qfs       = require('q-io/fs');
var path      = require('path');
//var jDataView = require('jdataview');

function testReadOnlyStreamable(class_, obj, ref_content) {

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
        
          it('must correctly read binary data in one or more chunks', function(done) {
            var buffer = new Uint8Array(ref_content.length);
            var bytes = 0;
            return obj.open('rb')
              .then( function(reader) {
                return reader.forEach( function writer(chunk, thisp) {
                  for (var i = 0; i < chunk.length ; i ++) buffer[bytes+i] = chunk[i];
                  bytes += chunk.length;
                })
              })
              .then( function() { 
                bytes.should.equal(ref_content.length);
                for (var i = 0; i < bytes; i++) buffer[i].should.equal(ref_content[i]);
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
            content.length.should.equal(ref_content.length);
            for (var i = 0; i < content.length; i++) content[i].should.equal(ref_content[i]);
          })
          .done( function() { done() } )
      })
      
    }) // #read()
    
  })  
}

function testStreamable(class_, obj) {

  describe('The object must implement the "Streamable" interface functions:', function() {
  
    it('must have a "write()" method', function() { (typeof obj.write).should.equal('function'); } );
    
    describe('#write()', function() {
      it('must be able to store binary data that can be retrieved by read()', function(done) {
        var buffer = Uint8Array([0,1,2,3,4,5,6,7,8,9,0xA,0xB,0xC,0xD,0xE,0xF]);
        obj.write(buffer)
          .then( function() { return obj.read('b') } )
          .then( function(data) { for (var i = 0; i < 16; i++) { data[i].should.equal(i) } } )
          .done( function() { done() } )
      })
    })
  })
}

//-------------------------------------

/** The following is a meta-test: it tests the test suite using a mocked-up Streamable object.
    This meta-test will be executed automatically whenever this module is require'd.
 */

describe('Testing the test function for read-only Streamables using a mocked-up object:', function() {

  var tmp_dir, tmp_file;
  var ref_content;
  
  var tmp_dir = process.env['TEMP'];
  tmp_file = path.join(tmp_dir, 'testdata.bin');

  ref_content = fs.readFileSync(path.join(__dirname, 'data/350r.jpg'));
  
  var readable = {
    open: function(options) {
      return qfs.open(path.join(__dirname, 'data/350r.jpg'), options);
    },
    
    read: function(options) {
      return qfs.read(path.join(__dirname, 'data/350r.jpg'), options);
    }
  };

  var writeable = {
    open: function(options) {
      return qfs.open(tmp_file, options);
    },
    
    write: function(content, options) {
      return qfs.write(tmp_file, content, options);
    },

    read: function(options) {
      return qfs.read(tmp_file, options);
    }
  };

  //console.log(content);
  testReadOnlyStreamable('TestClass', readable, ref_content);
  testStreamable('TestClass', writeable);
  
})

//--- MODULE EXPORTS ------------------

module.exports = {
  testReadOnlyStreamable: testReadOnlyStreamable,
  testStreamable: testStreamable
}
