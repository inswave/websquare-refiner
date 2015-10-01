var system = require('system'),
    page = require('webpage').create();

var basePath = system.args[1],
    baseURL = system.args[2],
    w2xPath = system.args[3],
    url = baseURL + '?w2xPath=' + w2xPath;

page.viewportSize = { width: 1440, height: 910 };

page.open( url, function (status) {
  console.log(status);
  page.render( basePath + w2xPath.substring( 0, w2xPath.length - 3 ) + 'png' );
  phantom.exit();
} );
