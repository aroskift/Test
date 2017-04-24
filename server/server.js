let express = require('express'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  app = express(),
  appPort = 8080,
  webroot = __dirname+'/../webroot/';

//Internal variable for storing task lists.
//Saving and loading from file system is left as an excercise for the reader
let taskListSets = {};

//Register bodyparser for json with our server
app.use(bodyParser.json());

//Serve content from the webroot folder as static files.
app.use(express.static(webroot));

let sendMalformedResponseError = (res) => {
  res.status(201);
  res.json("Malformed request. Name missing.");
};
let sendNotFoundResponseError = (res) => {
  res.status(404);
  res.json("Not found");
};

//Returns a full set of all task lists by name currently in memory.
app.get('/tasklists', (req, res) => {
  res.json(Object.keys(taskListSets));
});

app.get('/tasklist/:name', (req, res) => {
  let name = req.params.name;
  if (!name || !taskListSets[name]){
    sendNotFoundResponseError(res);
    return;
  }

  res.json(taskListSets[name]);
});

//Add a new task list set with the provided name. If the task list already exists it is replaced.
app.post('/tasklist/:name', (req, res) => {
  let name = req.params.name;
  if (!name){
    sendMalformedResponseError(res);
    return;
  }

  let taskListsSetAlreadyExists = !!taskListSets[name];

  taskListSets[name] = req.body; //Dump json body directly here
  res.status(201);
  res.json(taskListsSetAlreadyExists ? 'updated' : 'added');
});

app.delete('/tasklist/:name', (req, res) => {
  let name = req.params.name;
  if (!name){
    sendMalformedResponseError(res);
    return;
  }

  if (!taskListSets[name]){
    sendNotFoundResponseError(res);
    return;
  }

  delete taskListSets[name];
  res.json("deleted");
});

console.log('Serving static files from', webroot, 'on port', appPort);
//Start the server and wait for connections
app.listen(appPort);