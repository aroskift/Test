let express = require('express'),
  fs = require('fs'),
  app = express(),
  appPort = 8080,
  webroot = __dirname+'/../webroot/';

app.use(express.static(webroot));

console.log('Serving static files from', webroot, 'on port', appPort);
app.listen(appPort);