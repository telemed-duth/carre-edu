'use strict';

angular.module('edumaterialApp')
  .service('rdf', function ($http) {

    
    /****** private functions *******/
    
    function makeTriple(s,p,o){
      //check if object is value
      if(o.indexOf('^^')===-1) o='<'+o+'>'; 
      return '<'+s+'>'+' '+'<'+p+'>'+' '+o;
    }
    
    function parseTriples(arr){
      return arr.map(function(triple){
        return makeTriple(triple[0],triple[1],triple[2]);
      }).join('.');
    }
    
    
    //main post query
    function query(query){
      return $http.post('/api/resources/query',
        {
        'sparql':query
        },
        {
        'cache':true,
        ignoreLoadingBar: true
        }
      );
    }
    
    //make find query
    function find(triples,selectArray){
      if(!selectArray) selectArray=['*'];
      if(!triples) triples=['?s ?p ?o'];
    
      return query(
        'SELECT '+selectArray.join(' ')+' '+
        'FROM <https://carre.kmi.open.ac.uk/public> '+
        'WHERE { '+
          parseTriples(triples)+
        '}'
        );
    }
    
    //make insert query
    function insert(triples){
      if(!triples||triples.length<1) return {error:'You have not specified any triples'};
      return query(
        'INSERT DATA { '+
          'GRAPH '+
            '<https://carre.kmi.open.ac.uk/public> { '+
              parseTriples(triples)+
            '}'+
        '}'
      );
    }
    
    return {
      query:query,
      find:find,
      insert:insert
    };
    
  });
