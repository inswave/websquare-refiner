var Nightmare = require('nightmare'),
    fs = require('fs'),
    path = require('path');

var confFile = './conf/capture.json',
    size = {
      general: {
        width: 1440, height: 910
      },
      mobile: {
        width: 1044, height: 828
      }
    },
    waitCondition = {
      general: [ function() {
        return $W ? $W.scriptSectionExcuteFlag : '';
      }, 'executed' ],
      mobile: [30000]
    };

var content = fs.readFileSync( confFile, 'utf-8' ),
    conf = JSON.parse( content ),
    general = conf.w2xPath.general,
    mobile = conf.w2xPath.mobile;

var capture = function capture ( list, type ) {
  for ( p in list ) {
    var w2xPath = list[p],
        url = conf.baseURL + '?w2xPath=' + w2xPath,
        nightmare = new Nightmare();

    console.log(url);

    nightmare = nightmare
      .viewport( size[type].width, size[type].height )
      .goto( url );

    nightmare = nightmare.wait.apply( nightmare, waitCondition[type] );

    nightmare.screenshot( path.resolve( conf.basePath + w2xPath.substring( 0, w2xPath.length - 3 ) + 'png' ) )
      .run( function( err, nightmare ) {
        console.log( 'Done.' );
      } );
  }
};

capture( general, 'general' );
//capture( mobile, 'mobile' );
