'use strict';

angular.module('edumaterialApp')
  .service('rdf', function ($http,$q, CONFIG) {

    
    
    //prefixes
    var prefixes={
      edu:'http://'+CONFIG.graph_url+'/ontology/educational.owl',
      rdftype:'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      dc:'http://purl.org/dc/elements/1.1/',
      publicUri:'http://'+CONFIG.graph_url+'/'+CONFIG.subgraph_url+'/educational/',
      users:'https://'+CONFIG.graph_url+'/users/'
    }
    
    /****** private functions *******/
    
    function makeTriple(s,p,o,a,b,c){
      //check if object is value
      // s=String(s).replace(/<[^>]+>/gm, '');
      // p=String(p).replace(/<[^>]+>/gm, '');
      // o=String(o).replace(/<[^>]+>/gm, '');
    
      if(s&&s.indexOf('http')>=0&&!a) s='<'+s+'>';
      if(p&&p.indexOf('http')>=0&&!b) p='<'+p+'>';
      if(o&&o.indexOf('http')>=0&&!c) o='<'+o+'>';
      return s+' '+p+' '+o;
    }
    
    function parseTriples(arr){
      return arr.map(function(triple){
        return makeTriple(triple[0],triple[1],triple[2]);
      }).join('.');
    }
    
    
    //main post query
    function query(query){
      
      console.debug("---SPARQL QUERY---");
      console.debug(query);
        
      if(query.indexOf('undefined')>=0) {
        console.error("SPARQL query -- Undefined");
        console.debug(query);
        // deferred.reject("SPARQL query -- Undefined");
        return $q.defer().promise;
        
      } else return $http.post('/api/resources/query',
        {
        'sparql':query
        },
        {
        ignoreLoadingBar: true
        }
      );
    }
    
    //make find query
    function find(triples,selectArray,options){
      if(!selectArray) selectArray=['*'];
      if(!triples) triples=['?s ?p ?o'];
      if(!options) options=['LIMIT 20'];
    
      return query(
        'SELECT '+selectArray.join(' ')+' '+
        'FROM <http://'+CONFIG.graph_url+'/'+CONFIG.subgraph_url+'> '+
        'WHERE { '+
          parseTriples(triples)+
        '} '+
        options.join(' ')
        );
    }    
    
    //make modify query
    function modify(triples,templateToDelete,templateToInsert){
      if(!triples) triples=[];
      if(!templateToInsert) templateToInsert=[];
      if(!templateToDelete) templateToDelete=[];
    
      return query(
        'MODIFY <http://'+CONFIG.graph_url+'/'+CONFIG.subgraph_url+'> '+
        'DELETE { '+parseTriples(templateToDelete)+' } '+
        'INSERT { '+parseTriples(templateToInsert)+' } '+
        'WHERE { '+
          parseTriples(triples)+
        '} '
        );
    }
    
    //make insert query
    function insert(triples){
      if(!triples||triples.length<1) {
        return $q.reject({error:'You have not specified any triples',data:triples});
      }
      return query(
        'INSERT DATA { '+
          'GRAPH '+
            '<http://'+CONFIG.graph_url+'/'+CONFIG.subgraph_url+'> { '+
              parseTriples(triples)+
            '}'+
        '}'
      );
    }
    
    return {
      query:query,
      find:find,
      insert:insert,
      modify:modify,
      
      pre:prefixes
      
    };
    
  });
