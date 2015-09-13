var fs = require('fs'),
    path = require('path');

var domParser = require('xmldom').DOMParser,
    xpath = require('xpath');

var ArrayProto = Array.prototype,
    push       = ArrayProto.push;

var targetDir = '/Users/maninzoo/Contents/webstorm/projects/websquare-refiner/samples/';
//var targetDir = '/Users/maninzoo/Contents/temp/09_13_2015/mp/xml/';

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
      if ( nodeName === 'Grid' ) {
        if ( !result[nodeName].subModules ) {
          result[nodeName].subModules = {};
        }
        itemResult = result[nodeName].subModules;
      } else if ( ( nodeName === 'head' || nodeName === 'body' ) &&
                    node.parentNode.parentNode.nodeName === 'Grid' ) {
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
};

var collectUsage = function(list) {
  var result = {};

  list.forEach( function( file, i ) {
    //console.log( i + ' ' + file );

    var content = fs.readFileSync( file, 'utf-8' ),
        doc = new domParser().parseFromString(content),
        nodes = doc.childNodes;

    var i;

    for ( i = 0; i < nodes.length; i++ ) {
      storeData( nodes[i], result );
    }
  } );

  console.log( JSON.stringify(result) );
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
          results.push(file);
          if ( !--pending) done( null, results );
        }
      } );
    } );
  } );
};

getFileList( targetDir, function( err, list ) {
  if ( err ) {
    console.error( err );
  }

  collectUsage(list);
} );
