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
  api_url: process.env.CARRE_API_URL || 'https://carre.kmi.open.ac.uk/ws/',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'edumaterial-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  carre: {
    userAuthorizationURL:  process.env.CARRE_USER_AUTHORIZATION_URL||'',
    accessTokenURL:  process.env.CARRE_ACCESS_TOKEN_URL||'',
    requestTokenURL:  process.env.CARRE_REQUEST_TOKEN_URL||'',
    clientID:     process.env.CARRE_ID || 'id',
    clientSecret: process.env.CARRE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/carre/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  }
};


var merged = {};
Object.assign(merged, all, require('./' + process.env.NODE_ENV + '.js') || {});

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = merged;