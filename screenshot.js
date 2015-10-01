var path = require('path'),
    fs = require('fs'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    binPath = phantomjs.path;

var confFile = './conf/capture.json',
    content = fs.readFileSync( confFile, 'utf-8' ),
    conf = JSON.parse(content),
    general = conf.w2xPath.general;

var childArgs = [
  path.join( __dirname, 'samples', 'swing.js' ),
  conf.basePath,
  conf.baseURL
];

var getImage = function( w2xPath ) {
  childArgs[3] = w2xPath;

  console.log( 'START ' + w2xPath );

  try {
    console.log( childProcess.execFileSync( binPath, childArgs ).toString() );
  } catch(e) {
    console.error(e);
  }
};

for ( i in general ) {
  getImage( general[i] );
}
