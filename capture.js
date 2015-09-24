var Nightmare = require('nightmare'),
    fileManager = require('./util/fileManager');

var size = {
  general: {
    width: 1440, height: 910
  },
  mobile: {
    width: 1044, height: 828
  }
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

fileManager.getFileList( '/Users/maninzoo/Contents/temp/09_24_2015/SWING/', function( err, list ) {
  console.log( JSON.stringify(list) );
} );