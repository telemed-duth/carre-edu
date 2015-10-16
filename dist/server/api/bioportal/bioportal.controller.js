'use strict';

var _ = require('lodash');
var Bioportal = require('./bioportal.model');
var request = require('request');




// // Get a single medline
// exports.old_getOntologies = function(req, res) {
  
//   var query="PREFIX omv: <http://omv.ontoware.org/2005/05/ontology#>"+
//   "SELECT ?name ?acr WHERE {  ?ont a omv:Ontology . ?ont omv:acronym ?acr . ?ont omv:name ?name . }";
//   var client = new SparqlClient(endpoint);
//   console.log("Query to " + endpoint);
//   console.log("Query: " + query);
//   client.query(query)
//     //.bind('city', 'db:Chicago')
//     //.bind('city', 'db:Tokyo')
//     //.bind('city', 'db:Casablanca')
//     //.bind('city', '<http://dbpedia.org/resource/Vienna>')
//     .execute(function(error, results) {
//       if(error) console.log(error);
//       else if(results){
//         console.log(results);
//         if(results.results.bindings.length>0) {
//           var finalResults=[];
//           //extract data
//           for (var i = 0,r=results.results.bindings; i < r.length; i++) {
//             finalResults.push({'name':r[i].name.value,'acr':r[i].acr.value});
//           }
//           //testing results in console first
//           console.log(finalResults);
//           //ok now do something with the results
//           return res.json(200, finalResults);
          
//         } else return res.json(200, {'message':'no_results','data':results});
//       //process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");
//       } else return res.json(200, {'message':'error','data':results});
//   });



// };



// Get a single medline
exports.getOntologies = function(req, res) {
  
  //now run query
  request.get(
    {
      
  url:'http://sparql.bioontology.org/sparql/'+
  '?query=PREFIX+omv%3A+%3Chttp%3A%2F%2Fomv.ontoware.org%2F2005%2F05%2Fontology%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Facr+%3Fname%0D%0AWHERE+%7B%0D%0A%09%3Font+a+omv%3AOntology+.%0D%0A%09%3Font+omv%3Aacronym+%3Facr+.%0D%0A%09%3Font+omv%3Aname+%3Fname+.%0D%0A++++++++%0D%0A%7D+GROUP+BY+%3Facr%0D%0A++++++++&outputformat=json&kboption=ontologies&csrfmiddlewaretoken=53abe4fb6d2c806540016f405ad288b8',
  json:true
      
    },
    function (error, response, results) {
    if (!error && response.statusCode === 200) {
      if(results){
        if(results.results.bindings.length>0) {
          var finalResults=[];
          //extract data
          for (var i = 0,r=results.results.bindings; i < r.length; i++) {
            finalResults.push({'name':r[i].name.value,'acr':r[i].acr.value});
          }
          //testing results in console first
          // console.log(finalResults);
          //ok now do something with the results
          return res.status(200).json(finalResults);
        }
      //process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");
      }
    } else return res.status(500).json({'message':'error','data':error});
  });
};


// Get list of bioportals
exports.index = function(req, res) {
  Bioportal.find(function (err, bioportals) {
    if(err) { return handleError(res, err); }
    return  res.status(200).json(bioportals);
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
    return res.status(201).json(bioportal);
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