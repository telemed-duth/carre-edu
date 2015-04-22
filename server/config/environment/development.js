'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/edumaterial-dev'
  },
  rdfToken: process.env.RDF_TOKEN,
  seedDB: true
};
