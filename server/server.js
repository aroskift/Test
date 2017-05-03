let express = require('express');
let app = express();
let port = 8080;
let webroot = __dirname + '/../webroot';

app.use(express.static(webroot));

let todoLists = {
  //key => Name of todo list set
  //value = > Actual lists and todos
};

app.get('/tasklists', (req, res) => {
  res.json( Object.keys(todoLists) );
});

console.log('Serving static files from '+webroot+' at '+port);
app.listen(port);