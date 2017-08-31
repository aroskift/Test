'use strict';

// Include dependencies using CommonJs syntax (only for NodeJs applications)
const express = require('express'); // The actual webserver we're using
const cors = require('cors'); // Plugin for Express that enables Cross Origin Resource Sharing requests (CORS)
const helmet = require('helmet'); // Plugin for Express that secures our server by removing and adjusting response headers
const bodyParser = require('body-parser'); // Plugin for parsing the body of a request based on the requets headers
const hash = require('../shared/utils').hash;

const app = express(); // Create a new Express server instance
const port = 4321; // Define the listening port

// Apply plugins to our Express instance
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// A variable to store todos in memory
const store = {};



// Respond to requests

// Returns all keys in the store (don't worry, they are doubly hashed for EXTREME security ;)
app.get('/lists', (req, res) => {
  const keys = Object.keys(store);
  if (keys.length === 0){
    res.redirect('/404');
    return;
  }
  res.json(keys);
});

// Returns a specific store based on the incomming hash. Note that it hashes again before checking to avoid leakage (...ew)
app.get('/lists/:identifier', (req, res) => {
  const hashedIdentifier = hash(req.params.identifier);
  const lists = store[hashedIdentifier];
  if (!lists){
    res.redirect('/404');
    return;
  }
  res.json(lists);
});
// Sets the given lists under a double hashed identifier for EXTREME security ;)
app.post('/lists/:identifier', (req, res) => {
  const hashedIdentifier = hash(req.params.identifier);
  console.log('set', req.params.identifier, req.body);
  if (!req.body){
    delete store[hashedIdentifier];
    res.json({removed: true});
    return;
  }
  store[hashedIdentifier] = req.body;
  res.json({ok: true});
});

// Ah, whatever... expose a way to feth data if you know the hash (only for debug, remove from prod)
app.get('/lists-unsafe/:identifier', (req, res) => {
  const lists = store[req.params.identifier];
  if (!lists){
    res.redirect('/404');
    return;
  }
  res.json(lists);
});

// Final fallback route that runs if no other route handles the request
app.get('*', (req, res) => {
  res.sendStatus(404);
});




console.log('API server listening on :'+port);
// Start the server listening for requests on "port"
app.listen(port);