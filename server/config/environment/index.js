'use strict';

var path = require('path');



// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,
  
  // Get the token for the RDF USER
  rdfToken: process.env.RDF_TOKEN,
  
  // Get the token for the RDF USER
  api_url: process.env.API_URL,
  
  debug: process.env.DEBUG_MODE||false,

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
  
};


var merged = {};
Object.assign(merged, all, require('./' + process.env.NODE_ENV + '.js') || {});

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = merged;