var fs = require('fs'),
    path = require('path');

var fileManager = require('./fileManager');

var ArrayProto = Array.prototype,
    push       = ArrayProto.push;

module.exports.getFileList = function ( dir, done ) {
  var results = [];
  fs.readdir( dir, function( err, list ) {
    if (err) {
      return done(err);
    }

    var pending = list.length;
    if ( !pending ) {
      return done( null, results );
    }

    list.forEach( function(file) {
      file = path.resolve( dir, file );
      fs.stat( file, function( err, stat ) {
        if ( stat && stat.isDirectory() ) {
          fileManager.getFileList( file, function( err, res ) {
            push.apply( results, res );
            if ( !--pending ) done( null, results );
          } );
        } else {
          if ( file.lastIndexOf( '.xml' ) > 1 ) {
            results.push(file);
          } else {
            console.log( 'Omit ' + file );
          }
          if ( !--pending ) done( null, results );
        }
      } );
    } );
  } );
};
