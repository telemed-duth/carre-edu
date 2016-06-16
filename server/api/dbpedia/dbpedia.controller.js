'use strict';

var SparqlClient = require('sparql-client');
var endpoint = 'http://dbpedia.org/sparql';


  /* -------QUERY #2
  
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


/* -------QUERY #2 

"select distinct ?u ?label ?icd10 where { "+
"?u a dbpedia-owl:Disease ; "+
"dbpedia-owl:icd10 ?icd10 ;"+
"rdfs:label ?label ."+
"FILTER (REGEX(STR(?label), "obesity", "i"))"+
"FILTER (lang(?label)="en")"+
"} ORDER BY ?label LIMIT 500"

*/

/* -------QUERY #3 

  "SELECT ?disease WHERE { "+ 
    "?disease rdf:type dbpedia-owl:Disease ."+
    "?disease rdfs:label ?label ."+
    "filter(?label=\""+term+"\"@en)"+
    "} LIMIT 10";

*/



// Get a single medline
exports.dbpediaQuery = function(req, res) {
  var term=req.params.term;
  var lang=req.params.lang;
  
  
  var query=
  "select distinct ?u ?abstract ?wordnet ?medlineplus ?thumbnail ?meshid ?wikilink ?label ?icd10 where { "+
  "?u a dbpedia-owl:Disease ; "+
  "dbpedia-owl:icd10 ?icd10 ;"+
  "dbpedia-owl:abstract ?abstract ;"+
  "foaf:isPrimaryTopicOf ?wikilink ;"+
  "rdfs:label ?label ."+
  "OPTIONAL{?u dbpprop:wordnet_type ?wordnet }"+
  "OPTIONAL{?u dbpedia-owl:medlineplus ?medlineplus }"+
  "OPTIONAL{?u dbpprop:meshid ?meshid }"+
  "OPTIONAL{?u dbpedia-owl:thumbnail ?thumbnail }"+
  "FILTER (REGEX(STR(?label), \""+term+"\", \"i\"))"+
  (lang?"FILTER (lang(?label)=\""+lang+"\")":"")+
  (lang?"FILTER (lang(?abstract)=\""+lang+"\")":"")+
  "} ORDER BY ?label LIMIT 500";
  
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
      // console.log(data);
      if(data){
          if(data.results.bindings.length>0) return res.json(200, data.results.bindings);
          else return res.json(200, {'message':'no_results','data':data.results});
      } else return res.json(404, {'message':'dbpedia_error','data':null});
  });



};