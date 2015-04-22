'use strict';

angular.module('edumaterialApp')
  .service('article', function (rdf,uuid4,enrichment,rank,Auth) {
    var ratedArticles=[];
    var userRatedArticles=[];
    var curArticle={};
    var user=Auth.getCurrentUser()||{carre:{ graph:rdf.pre.users+'guestuser'}};
    

    //public functions
    
    function getUserRatedArticles(){
      rdf.find(
        [ 
          [ '?s', rdf.pre.edu+'#title', '?title' ],
          [ '?rating', rdf.pre.edu+'#for_article', '?s' ],
          [ '?rating', rdf.pre.edu+'#rated_by_user', user.carre.graph  ],
        ],
        ['?title ?rating'],
        ['LIMIT 1000']).success(function(results){
        userRatedArticles=results.data;
        console.log(userRatedArticles);
      });
    }

    function getRatedArticles(articles){
      console.log('Rated articles fetching');
      var exQuery=
      'SELECT ?title (AVG(?ratingval) as ?ratingavg) '+
      'WHERE {';
      
          for (var i = 0; i < articles.length; i++) {
            //add wikipedia url
            articles[i].url=articles[i].url||'http://en.wikipedia.org/wiki/'+encodeURI(articles[i].title).split('%20').join('_');
            
            exQuery+='{ ?s <'+rdf.pre.edu+'#url> <'+articles[i].url+'> }';
            if(i<(articles.length - 1)) { exQuery+=' UNION '; } 
          }
          
        exQuery+=' .'+
        '?s <'+rdf.pre.edu+'#title> ?title . '+ 
        '?rating <'+rdf.pre.rdftype+'> <'+rdf.pre.edu+'#rating> . '+ 
        '?rating <'+rdf.pre.edu+'#for_article> ?s . '+ 
        '?rating ?any ?ratingval . '+
        'FILTER (datatype(?ratingval) = xsd:integer) '+
      '} '+
      'GROUP BY ?title LIMIT 20';
    
      return rdf.query(exQuery).success(function(data){
          console.log('Rated Articles are:');
          ratedArticles=data.data;

          return data.data;
          // console.log(ratedArticles);
      }).error(function(err){
         console.log(err);
      }); 

    }
    
    function processArticle(article){
      
      console.log('processArticle: '+article.riskElement);
      
      curArticle=article;
      //check if this url already exists
      return rdf.find(
        [ ['?id',rdf.pre.edu+'#url',article.url] , ['?id',rdf.pre.edu+'#views','?views'] ],
        ['?id ?views'],
        ['LIMIT 1']
      ).success(function(results){
          
          console.log(results.data);
          if(results.data.length>0) { //if exists
            article.id=results.data[0].id.value.substring(48);
            article.views=Number(results.data[0].views.value);
            
            //update the views
            modifyArticleViews({
              id:article.id,
              views:article.views,
              url:article.url,
              riskElement:article.riskElement
            });
            
            
          }
          else { 
            
            //create new
            article.id=uuid4.generate();
            article.views=1;
          
            insertArticle(article);
          }
          curArticle.id=article.id;
        }).error(function(err){
          console.log(err);
          return false;
        });
    }
    
    function modifyArticleViews(article){
      
      console.log('insertArticle: '+article.riskElement);
      
      var oldtriples=[];
      var newtriples=[];
      
      
      //modify views
      oldtriples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#views', '"'+article.views+'"^^xsd:nonNegativeInteger'  ] );
      newtriples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#views', '"'+(article.views+1)+'"^^xsd:nonNegativeInteger'  ] );
      if(article.riskElement) newtriples.push( [ article.riskElement, 'http://carre.kmi.open.ac.uk/ontology/risk.owl#has_educational_material', rdf.pre.publicUri+article.id  ] );
    
      rdf.modify(oldtriples,oldtriples,newtriples).success(function(results){
        console.log(newtriples);
        console.log(results);
      }).error(function(error){
        console.log('Error :');
        console.log(error);
      });
    } 
    
    function insertArticle(article){
      
      console.log('insertArticle: '+article.riskElement);
      
      var triples=[];
      
      //mantadory metadata
      triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.rdftype, rdf.pre.edu+'#object' ] );
      triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#url', article.url ] );
      triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#views', '"'+article.views+'"^^xsd:nonNegativeInteger'  ] );
      
      //optional metadata
      if(article.date) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#date_accepted', '"'+article.date+'"^^xsd:date' ] );
      if(article.title) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#title', '"'+article.title+'"^^xsd:string'  ] );
      if(article.snippet) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#snippet', '"'+article.snippet+'"^^xsd:string'  ] );
      if(article.lang) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#language', '"'+article.lang+'"^^xsd:string'  ] );
      if(article.wordcount) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ] );
      if(article.categories) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#categories', '"'+article.categories+'"^^xsd:string'  ] );
      if(article.source) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#source', '"'+article.source+'"^^xsd:string' ] );
      if(article.websource) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#websource', '"'+article.websource+'"^^xsd:string'  ] );
      if(article.altTitle) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ] );
      if(article.riskElement) triples.push( [ article.riskElement, 'http://carre.kmi.open.ac.uk/ontology/risk.owl#has_educational_material', rdf.pre.publicUri+article.id  ] );
        
      rdf.insert(triples).success(function(results){
        
        
        //if you insert the article start the enrichment process
        console.log(triples);
        console.log(results);
      }).error(function(error){
        console.log('Error :');
        console.log(error);
      });
    }


    return {
      getUserRated:getUserRatedArticles,
      getRated:getRatedArticles,
      userRated:function(){return userRatedArticles},
      rated:function(){return ratedArticles},
      insert:processArticle,
      getCurrent:function(){return curArticle}
    };
  });
