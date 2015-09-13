var Nightmare = require('nightmare');
var underscore = require('underscore');

var orderHandler = function orderHandler() {
  var _ = underscore,
      arrange = function arrange( childItems ) {
        childItems.sort( function( item ) {

        });
      };

  return function(comStructure) {
    //console.log( comStructure );
    arrange(comStructure);
  }
};

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
        checkWClass = function( classList, classKeys ) {
          var j = 0,
              wClass = '';

          for ( j; j < classKeys.length; j++ ) {
            if ( classList[classKeys[j]].indexOf('w2') === 0 ) {
              wClass = classList[classKeys[j]];
              break;
            }
          }

          return wClass;
        },
        checkComplexCom = function ( wClass ) {
          var complexComList = {
            'w2grid': 'w2grid',
            'w2selectbox': 'w2selectbox',
            'w2inputCalendar_div': 'w2inputCalendar_div',
            'w2radio': 'w2radio'
          };

          return complexComList[wClass];
        },
        treeWalker = function ( ele, parentID, comStructure ) {
          var i,
              item,
              classList,
              wClass,
              result;

          for ( i = 0; i < ele.childElementCount; i++ ) {
            item = ele.childNodes[i];
            classList = item.classList;
            wClass = checkWClass( classList, Object.keys(classList) );

            if ( item.id && wClass ) {
              result = {};
              result.id = item.id;
              result.geo = item.getBoundingClientRect();
              result.childCount = item.childElementCount;
              result.name = item.localName;
              result.classList = classList;
              result.wClass = wClass;

              if ( item.childElementCount > 0 ) {
                //if ( depth < 2 ) {
                if ( !checkComplexCom(wClass) ) {
                  depth += 1;
                  result.childItems = [];
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

    return comStructure;
  }, orderHandler()
  )
  .run(function( err, nightmare ) {
    console.log('Done.');
  });
