'use strict';

var SparqlClient = require('sparql-client');
var endpoint = 'http://carre.kmi.open.ac.uk:8890/sparql';
// var ext_data=require('../../ext_data/riskelements');


// Get a single medline
exports.riskElements = function(req, res) {
  
  
/* file import of risk elements for demo purposes */
  // console.log(ext_data.riskelements());
  //return res.status(200).json(ext_data.riskelements());

  var lang = req.params.lang || "en";
  //  sparql query  to get the riskelements

  var query=
  "SELECT DISTINCT ?uri ?title FROM <http://carre.kmi.open.ac.uk/riskdata> WHERE {" +
  " { ?uri <http://carre.kmi.open.ac.uk/ontology/risk.owl#has_risk_element_name> ?title }" +
  " UNION { ?uri <http://carre.kmi.open.ac.uk/ontology/risk.owl#risk_element_name> ?title }" + 
  " FILTER (lang(?title)='"+lang+"')  } LIMIT 500";
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
