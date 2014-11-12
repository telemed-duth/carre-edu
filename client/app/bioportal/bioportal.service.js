'use strict';

angular.module('edumaterialApp')
  .factory('bioportal', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
      
      //bioportal general settings
      var settings={
        'apiurl':'http://data.bioontology.org', //api url
    
        //Common Parameters
        'apikey':'a15281a9-d87d-4c0f-b7aa-31debe0f6449', //your api key
        'include':'', // comma-separated list of attributes, EX: attr1,attr2
        'format':'json', //json, jsonp, xml
        'page':null, //the current page of results, call it from specific api function
        'pagesize':10, //count results per page
        'include_views': false, //boolean representing whether or not to include ontology views (default is false)
        'include_context': false, // true|false (defaults to true)
        'include_links': false, //{true|false} (defaults to true)
        'download_format':null, //{csv|rdf} (defaults to user-uploaded file format)
        
      };
      
      //search api implementation
      function search(page,query,ontologies,cuis) {
          
          var exact_match=false; // default = false
          var suggest=false; // default = false. Will perform a search specifically geared towards type-ahead suggestions.
          var also_search_views=true; // default = false
          var require_definition=true; // default = false
          var include_properties=true; // default = false
          var include_obsolete=false; // default = false (exclude obsolete terms)
          var cui=cuis||null; // Allows restricting query by CUIs. default = null (no restriction)
          //var semantic_types={T023,T185,T061} // Allows restricting query by Semantic Types (TUI). default = null (no restriction)
          var include='properties'; // default = (see Common Parameters section)
          
          //construct url
          var url=settings.apiurl+
          '/search?q='+query+
          '&ontologies='+ontologies+
          (cui?'&cui='+cui:'')+
          '&apikey='+settings.apikey+
          '&format='+settings.format+
          '&include='+include+
          '&include_views='+settings.include_views+
          '&include_context='+settings.include_context+
          '&include_links='+settings.include_links+
          '&download_format='+settings.download_format+
          '&page='+page+
          '&pagesize='+settings.pagesize+
          '&exact_match='+exact_match+
          '&suggest='+suggest+
          '&also_search_views='+also_search_views+
          '&require_definition='+require_definition+
          '&include_obsolete='+include_obsolete+
          '&include_properties='+include_properties;
          
          return $http.get(url);
      
        };
      
      return {
        //return all the api functions
        'search':search
        
        
        
      }
  });
