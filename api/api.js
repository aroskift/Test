'use strict';

// Include dependencies using CommonJs syntax (only for NodeJs applications)
const express = require('express'); // The actual webserver we're using
const cors = require('cors'); // Plugin for Express that enables Cross Origin Resource Sharing requests (CORS)
const helmet = require('helmet'); // Plugin for Express that secures our server by removing and adjusting response headers

const app = express(); // Create a new Express server instance
const port = 4321; // Define the listening port

// Apply plugins to our Express instance
app.use(cors());
app.use(helmet());


// Respond to requests

// Final fallback route that runs if no other route handles the request
app.get('*', (req, res) => {
  res.json({ok: true, time: new Date()});
});


console.log('Listening on :'+port);
// Start the server listening for requests on "port"
app.listen(port);