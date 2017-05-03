let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 8080;
let webroot = __dirname + '/../webroot';

app.use(bodyParser.json());
app.use(express.static(webroot));

let todoLists = {
  //key => Name of todo list set
  //value = > Actual lists and todos
};

app.get('/tasklists', (req, res) => {
  res.json( Object.keys(todoLists) );
});

app.get('/tasklists/:name', (req, res) => {
  if (!req.params.name){
    res.status(400);
    res.json("Parameter name must be a valid string.");
    return;
  }

  if (!todoLists[req.params.name]){
    res.status(404);
    res.json("Not found");
    return;
  }

  res.json(todoLists[req.params.name]);
});

app.post('/tasklists/:name', (req, res) => {
  if (!req.params.name){
    res.status(400);
    res.json("Parameter name must be a valid string.");
    return;
  }

  todoLists[req.params.name] = req.body;
  res.status(200);
  res.json('saved');
});

app.delete('/tasklists/:name', (req, res) => {
  if (!req.params.name){
    res.status(400);
    res.json("Parameter name must be a valid string.");
    return;
  }

  if (!todoLists[req.params.name]){
    res.status(404);
    res.json("Not found");
    return;
  }

  delete todoLists[req.params.name];
  res.json('deleted');
});

console.log('Serving static files from '+webroot+' at '+port);
app.listen(port);