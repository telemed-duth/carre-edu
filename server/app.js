/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// require('newrelic');

var express = require('express');
var config = require('./config/environment');


// Setup server
var app = express();
var server = require('http').createServer(app);


require('./config/express')(app);
require('./routes')(app);

var IP = '0.0.0.0';

// Start server
server.listen(config.port, IP, function () {
  console.log('Express server listening on %s : %d, in %s mode', IP, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;