'use strict';

var _ = require('lodash');
var Resource = require('./resource.model');
var config = require('../../config/environment');
var request = require('request');
var SparqlClient = require('sparql-client');
var util = require('util');




exports.oldquery = function(req, res){
  var q=req.body.sparql;
  var username='edudemo';
  var password='a12345678';
  var endpoint='http://carre.kmi.open.ac.uk:8890/sparql-auth';
  var query='SELECT * WHERE { ?s ?p ?q }';
  
// var client = new SparqlClient(endpoint);

// client.query(query)
//   //.bind('city', 'db:Chicago')
//   //.bind('city', 'db:Tokyo')
//   //.bind('city', 'db:Casablanca')
//   // .bind('city', '<http://dbpedia.org/resource/Vienna>')
//   .execute(function(error, data) {
//   if(error) {
//     console.log(error);
//     return res.status(500).json({'message':'server_error','data':error});
//   } else {
//     console.log(data);
//       if(data.results){
//         if(data.results.bindings.length>0) return res.json(200, data.results.bindings);
//         else return res.json(200, {'message':'no_results','data':data.results});
//       } 
//       else return res.json(404, {'message':'dbpedia_error','data':null});
//   }
  
// });

  
};

// api request
exports.EndPointquery = function(req, res) {

  var endpoint='http://carre.kmi.open.ac.uk:8890/sparql-auth';

  var options={
    method:'GET',
    url:endpoint+'?query='+req.body.sparql+'&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
    auth:{
      user:'edudemo',
      pass:'a12345678',
      sendImmediately:false
    }
  };
  
  request(options,function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return res.status(200).json(JSON.parse(body));
    } 
      
  });
  // console.log(sparql);
  // console.log(token);
    //now run query


};



// api request
exports.query = function(req, res) {

  var endpoint='https://carre.kmi.open.ac.uk:443/ws/';
  var options={
    method:'POST',
    url:endpoint+'query',
    json:true,
    body:{token:config.rdfToken,sparql:req.body.sparql}
  };
  
  request(options,function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('REQ: '+req.body.sparql);
      console.log('RES: '+body);
      return res.status(200).json({data:body});
    } 
    else res.status(500).json({data:error});    
  });
  // console.log(sparql);
  // console.log(token);
    //now run query
  // console.log('THE API TOKEN is : '+config.rdfToken);


};


// Get list of resources
exports.index = function(req, res) {
  Resource.find(function (err, resources) {
    if(err) { return handleError(res, err); }
    return res.json(200, resources);
  });
};

// Get a single resource
exports.show = function(req, res) {
  Resource.findById(req.params.id, function (err, resource) {
    if(err) { return handleError(res, err); }
    if(!resource) { return res.send(404); }
    return res.json(resource);
  });
};

// Creates a new resource in the DB.
exports.create = function(req, res) {
  Resource.create(req.body, function(err, resource) {
    if(err) { return handleError(res, err); }
    return res.json(201, resource);
  });
};

// Updates an existing resource in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Resource.findById(req.params.id, function (err, resource) {
    if (err) { return handleError(res, err); }
    if(!resource) { return res.send(404); }
    var updated = _.merge(resource, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, resource);
    });
  });
};

// Deletes a resource from the DB.
exports.destroy = function(req, res) {
  Resource.findById(req.params.id, function (err, resource) {
    if(err) { return handleError(res, err); }
    if(!resource) { return res.send(404); }
    resource.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}