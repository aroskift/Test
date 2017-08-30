'use strict';

// Include dependencies using CommonJs syntax (only for NodeJs applications)
const express = require('express'); // The actual webserver we're using
const cors = require('cors'); // Plugin for Express that enables Cross Origin Resource Sharing requests (CORS)
const helmet = require('helmet'); // Plugin for Express that secures our server by removing and adjusting response headers
const hash = require('../shared/utils');

const app = express(); // Create a new Express server instance
const port = 4321; // Define the listening port

// Apply plugins to our Express instance
app.use(cors());
app.use(helmet());

// A variable to store todos in memory
const store = {};

// Respond to requests

app.get('/lists', (req, res) => {
  res.json(Object.keys(store));
});

app.get('/lists/:identifier', (req, res) => {
  const hashedIdentifier = hash(req.params.identifier);
  const lists = store[hashedIdentifier];
  if (!lists){
    res.sendStatus(404);
  }
  res.json(lists);
});
app.post('/lists/:identifier', (req, res) => {
  const hashedIdentifier = hash(req.params.identifier);
  store[hashedIdentifier] = {};
  res.json({ok: true});
});

// Final fallback route that runs if no other route handles the request
app.get('*', (req, res) => {
  res.json({ok: true, time: new Date()});
});


console.log('Listening on :'+port);
// Start the server listening for requests on "port"
app.listen(port);