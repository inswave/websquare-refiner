var Nightmare = require('nightmare');

var size = { width: 1675, height: 890 };

var testUrl = 'http://swing.websquare.co.kr/websquare/websquare.html?w2xPath=/SWING/sample/main_fv.xml';

new Nightmare()
  .viewport( size.width, size.height )
  .goto( testUrl )
  .wait( function() {
    return $W ? $W.scriptSectionExcuteFlag : '';
  }, 'executed' )
  .screenshot( '/Users/maninzoo/Contents/temp/09_24_2015/capture/main_fv.png' )
  .run( function( err, nightmare ) {
    console.log( 'Done.' );
  } );
