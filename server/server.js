let express = require('express');
let app = express();
let port = 8080;
let webroot = __dirname + '/../webroot';

app.use(express.static(webroot));

console.log('Serving static files from '+webroot+' at '+port);
app.listen(port);