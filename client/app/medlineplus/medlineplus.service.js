'use strict';

angular.module('edumaterialApp')
  .factory('medlineplus', function ($http) {
// AngularJS will instantiate a singleton by calling "new" on this function
      
      //bioportal general settings
      var settings={
        'apiurl':'/api/medlineplus/query/', //api url
    
        //Common Parameters
        'db':'healthTopics', // healthTopics ,healthTopicsSpanish 
        'rettype':'brief', // Retrieval type. Default:brief ,topic, all 
        'retmax':10, //count results per page
        'tool': 'carre-project-educational-aggregator', //
        'email': 'portokallidis@gmail.com', // Email address. If you choose to provide an email address
        //'server': null, // Name of the server with the file referenced by the file parameter. This is required when the file parameter is being used.
        //'file':'' // ?file=viv_0Uu9LP&server=qvlbsrch04&
      };
      
      //search api implementation
      function search(retstart,query,limit) {
        
        //field searching to implement on client side
        //title ,alt-title,mesh,full-summary,group
        
          //construct url
          var url=settings.apiurl+
          'term='+encodeURI(query)+
          '&retstart='+(retstart||0)+
          '&db='+settings.db+
          '&rettype='+settings.rettype+
          '&retmax='+(limit||settings.retmax)+
          '&tool='+settings.tool+
          '&email='+settings.email;
          
          return $http.get(url,{'cache':true});
      
        };
      
      //Make public
      return {
        //return all the api functions
        'search':search
      };
  });
