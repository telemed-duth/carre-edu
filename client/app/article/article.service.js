'use strict';

angular.module('edumaterialApp')
  .service('article', function (rdf) {
    var ratedArticles=[];
  
  
    //prefixes
    var edu='https://carre.kmi.open.ac.uk/ontology/educational.owl';
    var rdftype='http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    var dc='http://purl.org/dc/elements/1.1/';
    //private functions
    function t(s,p,o){
      //check if object is value
      if(o.indexOf('^^')===-1) o='<'+o+'>'; 
      return '<'+s+'>'+' '+'<'+p+'>'+' '+o;
    };

        
    //public functions
    
    function all(){
      var triples=[];
      triples.push('?s ?p ?c');
      rdf.find(triples).success(function(results){
        ratedArticles=results;
      });
    };
    
    function insertArticle(article){
      var triples=[];
      
      triples.push( t( article.url,  rdftype, edu+'#object' ));
      if(article.date) triples.push( t( article.url,  edu+'#timestamp', '"'+article.date+'"^^xsd:date' ));
      if(article.title) triples.push( t( article.url,  edu+'#title', '"'+article.title+'"^^xsd:string'  ));
      if(article.snippet) triples.push( t( article.url,  edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ));
      if(article.lang) triples.push( t( article.url,  edu+'#language', '"'+article.lang+'"^^xsd:string'  ));
      if(article.wordcount) triples.push( t( article.url,  edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ));
      if(article.categories) triples.push( t( article.url,  edu+'#categories', '"'+article.categories+'"^^xsd:string'  ));
      if(article.source) triples.push( t( article.url,  edu+'#source', '"'+article.source+'"^^xsd:string' ));
      if(article.websource) triples.push( t( article.url,  edu+'#websource', '"'+article.websource+'"^^xsd:string'  ));
      if(article.altTitle) triples.push( t( article.url,  edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ));
      
        
      rdf.insert(triples).success(function(results){
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
    };
    
    function rateArticle(rating,user){
      var triples=[];
      
      triples.push( t( article.url,  rdftype, edu+'#object' ));
      if(article.date) triples.push( t( article.url,  edu+'#timestamp', '"'+article.date+'"^^xsd:date' ));
      if(article.title) triples.push( t( article.url,  edu+'#title', '"'+article.title+'"^^xsd:string'  ));
      if(article.snippet) triples.push( t( article.url,  edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ));
      if(article.lang) triples.push( t( article.url,  edu+'#language', '"'+article.lang+'"^^xsd:string'  ));
      if(article.wordcount) triples.push( t( article.url,  edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ));
      if(article.categories) triples.push( t( article.url,  edu+'#categories', '"'+article.categories+'"^^xsd:string'  ));
      if(article.source) triples.push( t( article.url,  edu+'#source', '"'+article.source+'"^^xsd:string' ));
      if(article.websource) triples.push( t( article.url,  edu+'#websource', '"'+article.websource+'"^^xsd:string'  ));
      if(article.altTitle) triples.push( t( article.url,  edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ));
      
        
      rdf.insert(triples).success(function(results){
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
    };
    
    
    function enrichArticle(enrichment){
      var triples=[];
      
      triples.push( t( article.url,  rdftype, edu+'#object' ));
      if(article.date) triples.push( t( article.url,  edu+'#timestamp', '"'+article.date+'"^^xsd:date' ));
      if(article.title) triples.push( t( article.url,  edu+'#title', '"'+article.title+'"^^xsd:string'  ));
      if(article.snippet) triples.push( t( article.url,  edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ));
      if(article.lang) triples.push( t( article.url,  edu+'#language', '"'+article.lang+'"^^xsd:string'  ));
      if(article.wordcount) triples.push( t( article.url,  edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ));
      if(article.categories) triples.push( t( article.url,  edu+'#categories', '"'+article.categories+'"^^xsd:string'  ));
      if(article.source) triples.push( t( article.url,  edu+'#source', '"'+article.source+'"^^xsd:string' ));
      if(article.websource) triples.push( t( article.url,  edu+'#websource', '"'+article.websource+'"^^xsd:string'  ));
      if(article.altTitle) triples.push( t( article.url,  edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ));
      
        
      rdf.insert(triples).success(function(results){
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
    };
    
    
    return {
      all:all,
      rated:all(),
      insert:insertArticle,
      rate:rateArticle,
      enrich:enrichArticle
    };
  });
