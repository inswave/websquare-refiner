var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

var domParser = require('xmldom').DOMParser;

var ArrayProto = Array.prototype,
    push       = ArrayProto.push;

//var targetDir = '/Users/maninzoo/Contents/webstorm/projects/websquare-refiner/samples/';
var targetDir = '/Users/maninzoo/Contents/temp/09_14_2015/mp/xml/';

var storeData = function ( node, result ) {
  var i,
      nodeName,
      nodes,
      namedNodeMap,
      attr,
      itemResult;

  // ELEMENT_NODE
  if ( node.nodeType === 1 ) {
    nodeName = node.nodeName;

    if ( nodeName !== 'Datasets' && nodeName !== 'Script' ) {
      if ( result[nodeName] ) {
        result[nodeName].count += 1;
      } else {
        console.log( nodeName );
        result[nodeName] = {};
        result[nodeName].count = 1;
      }

      if ( node.hasAttributes() ) {
        if ( !result[nodeName].attrs ) {
          result[nodeName].attrs = {};
        }
        namedNodeMap = node.attributes;

        for ( i = 0; i < namedNodeMap.length; i++ ) {
          attr = namedNodeMap.item(i);

          if ( result[nodeName].attrs[attr.name] ) {
            result[nodeName].attrs[attr.name] += 1;
          } else {
            result[nodeName].attrs[attr.name] = 1;
          }
        }
      }

      if ( node.hasChildNodes() ) {
        if ( nodeName === 'Grid' || nodeName === 'Radio' || nodeName === 'Combo' ) {
          if ( !result[nodeName].subModules ) {
            result[nodeName].subModules = {};
          }
          itemResult = result[nodeName].subModules;
        } else if ( ( nodeName === 'head' || nodeName === 'body' || nodeName === 'summary' ) &&
          ( node.parentNode.parentNode.nodeName === 'Grid' ||
          ( node.parentNode.nodeName === 'format' && node.parentNode.parentNode.parentNode.nodeName === 'Grid' ) ) ) {
          if ( !result[nodeName].subModules ) {
            result[nodeName].subModules = {};
          }
          itemResult = result[nodeName].subModules;
        } else {
          itemResult = result;
        }
        nodes = node.childNodes;
        for ( i = 0; i < nodes.length; i++ ) {
          storeData( nodes[i], itemResult );
        }
      }
    }
  }
};

var collectUsage = function(list) {
  var result = {};

  list.forEach( function( file, i ) {
    console.log( i + ' ' + file );

    var content = fs.readFileSync( file, 'utf-8' ),
        doc = new domParser().parseFromString(content),
        nodes = doc.childNodes;

    var i;

    for ( i = 0; i < nodes.length; i++ ) {
      storeData( nodes[i], result );
    }
  } );

  return result;
};

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
          if ( file.lastIndexOf( '.xml' ) > 1 ) {
            results.push(file);
          } else {
            console.log( 'Omit ' + file );
          }
          if ( !--pending) done( null, results );
        }
      } );
    } );
  } );
};

var sortData = function (data) {
  var result;

  var keys = _.keys(data);
  console.log(keys);

  result = _.map( keys, function ( d ) {
    var obj = data[d];
    obj.type = d;
    return obj;
  } );

  return result;
};

getFileList( targetDir, function( err, list ) {
  var data,
      sortedData;

  if ( err ) {
    console.error( err );
  }

  data = collectUsage(list);
  console.log( JSON.stringify(data) );

  sortedData = sortData(data);
  console.log( JSON.stringify(sortedData) );
} );
