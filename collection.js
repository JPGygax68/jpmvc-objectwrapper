"use strict";

var q = require('q');

/* Generic implementation for Collection#count().
 */
function count() {
  var n = 0;
  return this.each().progress( function(item) { n ++ } ).then( function() { return n } )
}

module.exports = {
  count: count
}