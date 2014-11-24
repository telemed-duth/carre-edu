/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/riskelements', require('./api/riskelements'));
  app.use('/api/wikipedia', require('./api/wikipedia'));
  app.use('/api/resources', require('./api/resource'));
  app.use('/api/ratings', require('./api/rating'));
  app.use('/api/bioportal', require('./api/bioportal'));
  app.use('/api/dbpedia', require('./api/dbpedia'));
  app.use('/api/medlineplus', require('./api/medlineplus'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
