/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/wikipedia', require('./api/wikipedia'));
  app.use('/api/resources', require('./api/resource'));
  app.use('/api/medlineplus', require('./api/medlineplus'));
  
  // send configuration object
  app.route('/api/config.js')
    .get(function(req, res) {
      
      res.status(200).send(
      "window.CARRE_EDU_CONFIGURATION={"+
        "language:'"+(process.env.LANGUAGE|| "en")+
        "',api_url:'"+(process.env.API_URL|| "https://devices.carre-project.eu/ws/")+
        "',token_name:'"+(process.env.TOKEN_NAME|| "CARRE_USER")+
        "',auth_url:'"+(process.env.AUTH_URL|| "https://devices.carre-project.eu/devices/accounts/")+
        "',graph_url:'"+(process.env.GRAPH_URL|| "carre.kmi.open.ac.uk")+
        "',subgraph_url:'"+(process.env.SUBGRAPH_URL|| "public")+"'}"
        );
    });
    
    
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
