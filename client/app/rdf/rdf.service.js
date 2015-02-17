'use strict';

angular.module('edumaterialApp')
  .service('rdf', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var token=''; //hardcode until we find a more suitable solution
    var api='https://carre.kmi.open.ac.uk:443/ws/';
    
    
    function q(query){
      return $http.post(api+'query',{
        'token':token,
        'sparql':query
      }).$promise;
    };
    
    //make find query
    function find(triples,selectArray){
      if(!selectArray) selectArray=['*'];
      return q(
        'SELECT '+selectArray.join(' ')+
        'WHERE {'+
          triples+
        '}'
        );
    };
    
    //make insert query
    
    function insert(triples){
      return q(
        'INSERT DATA { '+
          triples+
        '}'
      );
    };
    
    
    
  });
