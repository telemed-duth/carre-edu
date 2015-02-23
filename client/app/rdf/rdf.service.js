'use strict';

angular.module('edumaterialApp')
  .service('rdf', function ($http) {

    
    
    //prefixes
    var prefixes={
      edu:'https://carre.kmi.open.ac.uk/ontology/educational.owl',
      rdftype:'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      dc:'http://purl.org/dc/elements/1.1/',
      publicUri:'https://carre.kmi.open.ac.uk/public/educational/',
      users:'https://carre.kmi.open.ac.uk/users/'
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
    function find(triples,selectArray,options){
      if(!selectArray) selectArray=['*'];
      if(!triples) triples=['?s ?p ?o'];
      if(!options) options=['LIMIT 20'];
    
      return query(
        'SELECT '+selectArray.join(' ')+' '+
        'FROM <https://carre.kmi.open.ac.uk/public> '+
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
        'MODIFY <https://carre.kmi.open.ac.uk/public> '+
        'DELETE { '+parseTriples(templateToDelete)+' } '+
        'INSERT { '+parseTriples(templateToInsert)+' } '+
        'WHERE { '+
          parseTriples(triples)+
        '} '
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
      insert:insert,
      modify:modify,
      
      pre:prefixes
      
    };
    
  });
