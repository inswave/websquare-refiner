var fs = require('fs');
var path = require('path');

var ArrayProto = Array.prototype,
    push       = ArrayProto.push;

var targetDir = '/Users/maninzoo/Contents/temp/09_13_2015/mp/xml/';

var getFileList = function( dir, done ) {
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
          getFileList( file, function( err, res ) {
            push.apply( results, res );
            if ( !--pending ) done( null, results );
          } );
        } else {
          results.push(file);
          if ( !--pending) done( null, results );
        }
      } );
    } );
  } );
};

var collectUsage = function(list) {
  list.forEach( function( file, i ) {
    console.log( i + ' ' + file );
  } );
};

getFileList( targetDir, function( err, list ) {
  if ( err ) {
    console.error( err );
  }

  collectUsage(list);
} );
