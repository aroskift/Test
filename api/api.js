'use strict';

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const hash = require('../shared/utils').hash;

const app = express();
const port = 4321;

const store = {
  //Keys are identifiers, values are data
};

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  const result = {
    ok: true,
    timestamp: new Date()
  };

  res.json(result);
});

app.get('/lists', (req, res) => {
  const keys = Object.keys(store);
  if (keys.length === 0){
    res.sendStatus(404);
    return;
  }
  res.json(keys);
});
app.get('/lists/:identifier', (req, res) => {
  const hashedIndetifier = hash(req.params.identifier);
  const lists = store[hashedIndetifier];
  if (!lists){
    res.sendStatus(404);
    return;
  }
  res.json(lists);
});
app.post('/lists/:identifier', (req, res) => {
  const hashedIndetifier = hash(req.params.identifier);
  console.log('store lists', hashedIndetifier, req.body);
  store[hashedIndetifier] = req.body;
  res.json({ok:true});
});
app.delete('/lists/:identifier', (req, res) => {
  const hashedIndetifier = hash(req.params.identifier);
  delete store[hashedIndetifier];
  res.json({ok:true});
});

console.log('API server listening on :'+port);
app.listen(port);