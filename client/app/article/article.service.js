'use strict';

angular.module('edumaterialApp')
  .service('article', function (rdf,uuid4,enrichment) {
    var ratedArticles=[];
    var currentArticle=this.currentArticle||{};
    
    //prefixes
    var edu='https://carre.kmi.open.ac.uk/ontology/educational.owl';
    var rdftype='http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    var dc='http://purl.org/dc/elements/1.1/';
    var publicUri='https://carre.kmi.open.ac.uk/public/educational/';
        
    //public functions
    
    function all(){
      rdf.find([['?s','?p','?o']]).success(function(results){
        ratedArticles=results.data;
        console.log(ratedArticles);
      });
    };
    
    function processArticle(article){
      
      //check if this url already exists
      rdf.find(
        [ ['?id',edu+'#url',article.url] , ['?id',edu+'#views','?views'] ],
        ['?id ?views'],
        ['LIMIT 1']).success(function(results){
          
          console.log(results.data);
          if(results.data.length>0) { //if exists
            article.id=results.data[0].id.value.substring(48);
            article.views=Number(results.data[0].views.value);
            
            
            //update the views
            modifyArticleViews({
              id:article.id,
              views:article.views,
              url:article.url
            });
            
            
          }
          else { //create new
            article.id=uuid4.generate();
            article.views=1;
          
            insertArticle(article);
          }
        }).error(function(err){
          console.log(err);
        });
    }
    
    function modifyArticleViews(article){
      
      var oldtriples=[];
      var newtriples=[];
      
      //modify views
      oldtriples.push( [ publicUri+article.id, edu+'#views', '"'+(article.views-1)+'"^^xsd:nonNegativeInteger'  ] );
      newtriples.push( [ publicUri+article.id, edu+'#views', '"'+article.views+'"^^xsd:nonNegativeInteger'  ] );
    
      rdf.modify(oldtriples,oldtriples,newtriples).success(function(results){
        
      currentArticle.views=article.views;
        
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
    } 
    
    function insertArticle(article){
      
      var triples=[];
      
      //mantadory metadata
      triples.push( [ publicUri+article.id, rdftype, edu+'#object' ] );
      triples.push( [ publicUri+article.id, edu+'#url', article.url ] );
      triples.push( [ publicUri+article.id, edu+'#views', '"'+article.views+'"^^xsd:nonNegativeInteger'  ] );
      
      //optional metadata
      if(article.date) triples.push( [ publicUri+article.id, edu+'#date_accepted', '"'+article.date+'"^^xsd:date' ] );
      if(article.title) triples.push( [ publicUri+article.id,  edu+'#title', '"'+article.title+'"^^xsd:string'  ] );
      if(article.snippet) triples.push( [ publicUri+article.id,  edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ] );
      if(article.lang) triples.push( [ publicUri+article.id, edu+'#language', '"'+article.lang+'"^^xsd:string'  ] );
      if(article.wordcount) triples.push( [ publicUri+article.id,  edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ] );
      if(article.categories) triples.push( [ publicUri+article.id, edu+'#categories', '"'+article.categories+'"^^xsd:string'  ] );
      if(article.source) triples.push( [ publicUri+article.id, edu+'#source', '"'+article.source+'"^^xsd:string' ] );
      if(article.websource) triples.push( [ publicUri+article.id,  edu+'#websource', '"'+article.websource+'"^^xsd:string'  ] );
      if(article.altTitle) triples.push( [ publicUri+article.id, edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ] );
        
      rdf.insert(triples).success(function(results){
        
        
        //if you insert the article start the enrichment process
      currentArticle=article;
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
    }
    
    function enrichArticle(){
      
      var triples=[];
      // currentArticle.rating
      // var rating.id=uuid4.generate();
      
      triples.push( [ publicUri+uuid, rdftype, edu+'#rating' ] );
      triples.push( [ publicUri+uuid, edu+'#url', article.url ] );
      
      if(article.date) triples.push( [ publicUri+uuid, edu+'#date_accepted', '"'+article.date+'"^^xsd:date' ] );
      if(article.title) triples.push( [ publicUri+uuid,  edu+'#title', '"'+article.title+'"^^xsd:string'  ] );
      if(article.snippet) triples.push( [ publicUri+uuid,  edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ] );
      if(article.lang) triples.push( [ publicUri+uuid, edu+'#language', '"'+article.lang+'"^^xsd:string'  ] );
      if(article.wordcount) triples.push( [ publicUri+uuid,  edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ] );
      if(article.categories) triples.push( [ publicUri+uuid, edu+'#categories', '"'+article.categories+'"^^xsd:string'  ] );
      if(article.source) triples.push( [ publicUri+uuid, edu+'#source', '"'+article.source+'"^^xsd:string' ] );
      if(article.websource) triples.push( [ publicUri+uuid,  edu+'#websource', '"'+article.websource+'"^^xsd:string'  ] );
      if(article.altTitle) triples.push( [ publicUri+uuid, edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ] );
      
      
      
    }    
    
    
    function rateArticle(){
      
      var triples=[];
      var uuid=uuid4.generate();
      
      triples.push( [ publicUri+uuid, rdftype, edu+'#object' ] );
      triples.push( [ publicUri+uuid, edu+'#url', article.url ] );
      
      if(article.date) triples.push( [ publicUri+uuid, edu+'#date_accepted', '"'+article.date+'"^^xsd:date' ] );
      if(article.title) triples.push( [ publicUri+uuid,  edu+'#title', '"'+article.title+'"^^xsd:string'  ] );
      if(article.snippet) triples.push( [ publicUri+uuid,  edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ] );
      if(article.lang) triples.push( [ publicUri+uuid, edu+'#language', '"'+article.lang+'"^^xsd:string'  ] );
      if(article.wordcount) triples.push( [ publicUri+uuid,  edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ] );
      if(article.categories) triples.push( [ publicUri+uuid, edu+'#categories', '"'+article.categories+'"^^xsd:string'  ] );
      if(article.source) triples.push( [ publicUri+uuid, edu+'#source', '"'+article.source+'"^^xsd:string' ] );
      if(article.websource) triples.push( [ publicUri+uuid,  edu+'#websource', '"'+article.websource+'"^^xsd:string'  ] );
      if(article.altTitle) triples.push( [ publicUri+uuid, edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ] );
      
    }
    

    return {
      rated:all(),
      insert:processArticle
    };
  });
