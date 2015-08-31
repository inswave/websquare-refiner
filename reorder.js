var Nightmare = require('nightmare');

new Nightmare()
  .goto('http://yahoo.com')
  .wait('body')
  .evaluate( function() {
    return window;
  }, function( window ) {
    debugger;
  } )
  .run(function( err, nightmare ) {
    console.log('Done.');
  });