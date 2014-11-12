'use strict';

var _ = require('lodash');
var Bioportal = require('./bioportal.model');
var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://dbpedia.org/sparql';




// Get a single medline
exports.dbpediaQuery = function(req, res) {
  var term=req.params.term;

  /*
  select distinct ?u ?label ?icd10
where {
?u a dbpedia-owl:Disease ;
   ?p ?value ;
   dbpedia-owl:icd10 ?icd10 ;
   rdfs:label ?label .

FILTER (REGEX(STR(?value), "diabetes", "i"))
FILTER (lang(?value)="en")
FILTER (lang(?label)="en")
} 
ORDER BY ?label
LIMIT 500
*/
  var query="SELECT ?disease WHERE { ?disease rdf:type dbpedia-owl:Disease .?disease rdfs:label ?label . filter(?label=\""+term+"\"@en)} LIMIT 10";
  var client = new SparqlClient(endpoint);
  //console.log("Query to " + endpoint);
  //console.log("Query: " + query);
  client.query(query)
    //.bind('city', 'db:Chicago')
    //.bind('city', 'db:Tokyo')
    //.bind('city', 'db:Casablanca')
    //.bind('city', '<http://dbpedia.org/resource/Vienna>')
    .execute(function(error, results) {
      if(results){
        if(results.nlmSearchResult.length>0) {
            return res.json(200, results);
        } else return res.json(200, {'message':'no_results','data':results});
      //process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");
      }
      if(error) console.log(error);
      if(results) console.log(results);
  });



};

// Get list of bioportals
exports.index = function(req, res) {
  Bioportal.find(function (err, bioportals) {
    if(err) { return handleError(res, err); }
    return res.json(200, bioportals);
  });
};

// Get a single bioportal
exports.show = function(req, res) {
  Bioportal.findById(req.params.id, function (err, bioportal) {
    if(err) { return handleError(res, err); }
    if(!bioportal) { return res.send(404); }
    return res.json(bioportal);
  });
};

// Creates a new bioportal in the DB.
exports.create = function(req, res) {
  Bioportal.create(req.body, function(err, bioportal) {
    if(err) { return handleError(res, err); }
    return res.json(201, bioportal);
  });
};

// Updates an existing bioportal in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bioportal.findById(req.params.id, function (err, bioportal) {
    if (err) { return handleError(res, err); }
    if(!bioportal) { return res.send(404); }
    var updated = _.merge(bioportal, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, bioportal);
    });
  });
};

// Deletes a bioportal from the DB.
exports.destroy = function(req, res) {
  Bioportal.findById(req.params.id, function (err, bioportal) {
    if(err) { return handleError(res, err); }
    if(!bioportal) { return res.send(404); }
    bioportal.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}