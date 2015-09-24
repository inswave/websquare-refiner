var Nightmare = require('nightmare'),
    fs = require('fs'),
    path = require('path');

//var fileManager = require('./util/fileManager');

var confFile = '/Users/maninzoo/Contents/temp/09_24_2015/capture/capture.conf.json',
    size = {
      general: {
        width: 1440, height: 910
      },
      mobile: {
        width: 1044, height: 828
      }
    },
    waitCondition = {

    };
/*
//var testUrl = 'http://swing.websquare.co.kr/websquare/websquare.html?w2xPath=/SWING/sample/main_fv.xml';
var testUrl = 'http://swing.websquare.co.kr/websquare/websquare.html?w2xPath=/SWING/conversion/ZORDSB0900010_WS5.xml';
//var testUrl = 'http://swing.websquare.co.kr/websquare/websquare.html?w2xPath=/SWING/mobile/workFrame3.xml';

new Nightmare()
  //.viewport( size.mobile.width, size.mobile.height )
  .viewport( size.general.width, size.general.height )
  .goto( testUrl )
  .wait( function() {
    return $W ? $W.scriptSectionExcuteFlag : '';
  }, 'executed' )
  //.wait( 30000 )
  .screenshot( '/Users/maninzoo/Contents/temp/09_24_2015/capture/main_fv.png' )
  .run( function( err, nightmare ) {
    console.log( 'Done.' );
  } );
*/

//fileManager.getFileList( '/Users/maninzoo/Contents/temp/09_24_2015/SWING/', function( err, list ) {
//  console.log( JSON.stringify(list) );
//} );

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

    nightmare
      .viewport( size[type].width, size[type].height )
      .goto( url )
      .wait( function() {
        return $W ? $W.scriptSectionExcuteFlag : '';
      }, 'executed' )
      .screenshot( path.resolve( conf.basePath + w2xPath.substring( 0, w2xPath.length - 3 ) + 'png' ) )
      .run( function( err, nightmare ) {
        console.log( 'Done.' );
      } );
  }
};

capture( general, 'general' );
