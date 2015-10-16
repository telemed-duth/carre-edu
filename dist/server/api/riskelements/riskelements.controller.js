'use strict';

var _ = require('lodash');
var Riskelements = require('./riskelements.model');
var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://carre.kmi.open.ac.uk:8890/sparql';
// var ext_data=require('../../ext_data/riskelements');


// Get a single medline
exports.riskElements = function(req, res) {
  
  
/* file import of risk elements for demo purposes */
  // console.log(ext_data.riskelements());
  //return res.status(200).json(ext_data.riskelements());


  //  sparql query  to get the riskelements

  var query=
  "SELECT DISTINCT ?uri ?title WHERE {" +
  " { ?uri <http://carre.kmi.open.ac.uk/ontology/risk.owl#has_risk_element_name> ?title }" +
  " UNION { ?uri <http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_name> ?title }" + 
  " } LIMIT 500";
  var results=[];
  var client = new SparqlClient(endpoint);
  //console.log("Query to " + endpoint);
  //console.log("Query: " + query);
  client.query(query)
    //.bind('city', 'db:Chicago')
    //.bind('city', 'db:Tokyo')
    //.bind('city', 'db:Casablanca')
    //.bind('city', '<http://dbpedia.org/resource/Vienna>')
    .execute(function(error, data) {
      if(error) {
        console.log(error);
        res.json(500, {'message':'server_error','data':error});
      }
      
      if(data){
          if(data.results.bindings.length>0) {
            results=data.results.bindings
              .filter(function(obj){
                return (
                  obj.title.value.length<30 && 
                  obj.title.value.length>2 && 
                  obj.title.value.substr(0,1)!=='2' && 
                  obj.title.value.substr(0,4)!=='elem' 
                );
              })
              .map(function(obj){
                return {'name':obj.title.value,'url':obj.uri.value};
              });
            return res.json(200, results);
          }
          else return res.json(200, {'message':'no_results','data':data.results});
      } else return res.json(404, {'message':'dbpedia_error','data':null});
  });




};

// Get list of riskelementss
exports.index = function(req, res) {
  Riskelements.find(function (err, riskelementss) {
    if(err) { return handleError(res, err); }
    return res.json(200, riskelementss);
  });
};

// Get a single riskelements
exports.show = function(req, res) {
  Riskelements.findById(req.params.id, function (err, riskelements) {
    if(err) { return handleError(res, err); }
    if(!riskelements) { return res.send(404); }
    return res.json(riskelements);
  });
};

// Creates a new riskelements in the DB.
exports.create = function(req, res) {
  Riskelements.create(req.body, function(err, riskelements) {
    if(err) { return handleError(res, err); }
    return res.json(201, riskelements);
  });
};

// Updates an existing riskelements in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Riskelements.findById(req.params.id, function (err, riskelements) {
    if (err) { return handleError(res, err); }
    if(!riskelements) { return res.send(404); }
    var updated = _.merge(riskelements, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, riskelements);
    });
  });
};

// Deletes a riskelements from the DB.
exports.destroy = function(req, res) {
  Riskelements.findById(req.params.id, function (err, riskelements) {
    if(err) { return handleError(res, err); }
    if(!riskelements) { return res.send(404); }
    riskelements.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}