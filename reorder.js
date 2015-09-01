var Nightmare = require('nightmare');

// http://yahoo.com
var testUrl = 'http://127.0.0.1:8080/w5_skt/websquare.html?w2xPath=/w5_samples/ZCAMSTGT00318.xml';

new Nightmare()
  //.on( 'consoleMessage', function(msg) {
  //  console.log(msg);
  //} )
  .goto(testUrl)
  .wait( function() {
    return $W ? $W.scriptSectionExcuteFlag : '';
  }, 'executed')
  .evaluate( function() {
    var comStructure = [],
        body = document.body,
        depth = 0,
        treeWalker = function ( ele, parentID, comStructure ) {
          var i,
              item,
              result;

          for ( i = 0; i < ele.childElementCount; i++ ) {
            if ( ele.childNodes[i].id ) {
              result = {};
              item = ele.childNodes[i];
              result.id = item.id;
              result.geo = item.getBoundingClientRect();
              result.childCount = item.childElementCount;
              result.name = item.localName;
              result.classList = item.classList;

              if ( item.childElementCount > 0 ) {
                result.childItems = [];

                if ( depth < 2 ) {
                  depth += 1;
                  treeWalker( item, result.id, result.childItems );
                  depth -= 1;
                }
              }

              comStructure.push(result);
            }
          }
        };

    depth += 1;
    treeWalker( body, 'body', comStructure );

    return JSON.stringify(comStructure);
  }, function( comStructure ) {
    console.log( comStructure );
    //debugger;
  } )
  .run(function( err, nightmare ) {
    console.log('Done.');
  });
