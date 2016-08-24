'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/edumaterial-dev'
  },
  api_url: process.env.API_URL || 'https://devices.duth.carre-project.eu/ws/',
  debug:process.env.DEBUG_MODE||true,
  seedDB: false
};
