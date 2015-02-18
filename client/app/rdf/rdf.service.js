'use strict';

angular.module('edumaterialApp')
  .service('rdf', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
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
          triples.join('.')+
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
              triples.join('.')+
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
