'use strict';

var config = require('../../config/environment');
var request = require('request');


// api request
exports.query = function(req, res) {

  var endpoint= config.api_url;
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
  
};

// api request
exports.elements = function(req, res) {

  var endpoint= config.api_url;
  var type=req.params.type||"risk_element";
  var language=req.params.lang||"en";
  var options={
    method:'GET',
    url:endpoint+'instances',
    json:true,
    body:{token:config.rdfToken,type:type,language:language}
  };
  
  request(options,function (error, response, body) {
    if (!error && response.statusCode === 200) {
      
      // console.log('RES: '+body);
      var riskelements = [];
      body.forEach(function(elem){
        if(elem.predicate.indexOf('has_risk_element_name')>=0) {
          riskelements.push({
            name:elem.object,
            url:elem.subject
          })
        }
      })
      
      // riskelements {name:acute....,url:http://carre...}
      return res.status(200).json({data:riskelements});
    } 
    else res.status(500).json({data:error});    
  });
  // console.log(sparql);
  // console.log(token);
    //now run query
  // console.log('THE API TOKEN is : '+config.rdfToken);


};

