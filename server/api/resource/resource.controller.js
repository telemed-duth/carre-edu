'use strict';

var config = require('../../config/environment');
var request = require('request');


// api request
exports.query = function(req, res) {

  var endpoint= process.env.CARRE_API_URL || 'https://carre.kmi.open.ac.uk/ws/';
  var options={
    method:'POST',
    url:endpoint+'query',
    json:true,
    body:{token:config.rdfToken,sparql:req.body.sparql}
  };
  
  request(options,function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log('REQ: '+req.body.sparql);
      // console.log('RES: '+body);
      return res.status(200).json({data:body});
    } 
    else res.status(500).json({data:error});    
  });
  // console.log(sparql);
  // console.log(token);
    //now run query
  // console.log('THE API TOKEN is : '+config.rdfToken);


};

