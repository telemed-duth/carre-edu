'use strict';

angular.module('edumaterialApp')
  .service('article', function (rdf,uuid4,rank,Auth,CONFIG) {
    var ratedArticles=[];
    var userRatedArticles=[];
    var curArticle={};
    var user={};
    //async process user before setting to scope
    if(Auth.token) {
      // console.debug(Auth.token);
      if(Auth.getCurrentUser().$promise) Auth.getCurrentUser().then(function(){ user = Auth.getCurrentUser(); });
      else user = Auth.getCurrentUser();
    } else user = {};
    
    if(!user.hasOwnProperty('username')) user.graphName=rdf.pre.users+'guestuser'
    
    //'+CONFIG.subgraph_url+' functions
    
    function getUserRatedArticles(){
      rdf.find(
        [ 
          [ '?s', rdf.pre.edu+'#url', '?url' ],
          [ '?rating', rdf.pre.edu+'#for_article', '?s' ],
          [ '?rating', rdf.pre.edu+'#rated_by_user', user.graphName  ],
        ],
        ['?url ?rating'],
        ['LIMIT 1000']).then(function(results){
        userRatedArticles=results.data;
        console.log(userRatedArticles);
      });
    }

    function getRatedArticles(articles){
      console.log('Rated articles fetching');
      var exQuery=
      'SELECT ?url (AVG(?ratingval) as ?ratingavg) '+
      'FROM <http://'+CONFIG.graph_url+'/'+CONFIG.subgraph_url+'> WHERE {';
      
          for (var i = 0; i < articles.length; i++) {
            //add wikipedia url
            articles[i].url=articles[i].url||'http://'+Auth.language+'.wikipedia.org/wiki/'+encodeURIComponent(articles[i].title).split('%20').join('_');
            
            exQuery+='{ ?s <'+rdf.pre.edu+'#url> <'+articles[i].url+'> }';
            if(i<(articles.length - 1)) { exQuery+=' UNION '; } 
          }
          
        exQuery+=' .'+
        '?s <'+rdf.pre.edu+'#url> ?url . '+ 
        '?rating <'+rdf.pre.rdftype+'> <'+rdf.pre.edu+'#rating> . '+ 
        '?rating <'+rdf.pre.edu+'#for_article> ?s . '+ 
        '?rating ?any ?ratingval . '+
        'FILTER (datatype(?ratingval) = xsd:nonNegativeInteger) '+
      '} '+
      'GROUP BY ?url LIMIT 20';
    
      return rdf.query(exQuery).then(function(data){
          console.log('Rated Articles are:');
          ratedArticles=data.data;
          console.log(ratedArticles);

          return ratedArticles;
      }).catch(function(err){
         console.log(err);
      }); 

    }
    

    function getEducationalObject(id){
      console.log('fecth object by id');
      //check if this url already exists
      var eduid='http://'+CONFIG.graph_url+'/'+CONFIG.subgraph_url+'/educational/'+id;
      return rdf.find(
        [ 
          [eduid,rdf.pre.edu+'#url','?url'],
          [eduid,rdf.pre.edu+'#title','?title'],
          [eduid,rdf.pre.edu+'#snippet','?snippet'],
        ],
        ['?url ?title ?snippet'],
        ['LIMIT 100']
      );
          

    }
    
    function processArticle(article){
      article.riskElement = article.riskElement
      curArticle=article;
      //check if this url already exists
      return rdf.find(
        [ ['?id',rdf.pre.edu+'#url',article.url] , ['?id',rdf.pre.edu+'#views','?views'] ],
        ['?id ?views'],
        ['LIMIT 1']
      ).then(function(results){
          var elem={};
          if(results.data.data.length>0) { //if exists
          elem = results.data.data[0];
          console.log("Article exists: ",elem.id);
            article.id=elem.id.value.split(CONFIG.graph_url+"/"+CONFIG.subgraph_url+"/educational/")[1];
            article.views=Number(elem.views.value);
            
            //update the views
            modifyArticleViews({
              id:article.id,
              views:article.views,
              url:article.url,
              riskElement:article.riskElement
            });
            
            
          }
          else { 
            
            console.log("Article NOT exists: ",results.data.data);
            
            //create new
            article.id=uuid4.generate();
            article.views=1;
          
            insertArticle(article);
          }
          curArticle.id=article.id;
        }).catch(function(err){
          console.log(err);
          return false;
        });
    }
    
    function modifyArticleViews(article){
      
      var oldtriples=[];
      var newtriples=[];
      
      
      //modify views
      oldtriples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#views', '"'+article.views+'"^^xsd:nonNegativeInteger'  ] );
      newtriples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#views', '"'+(article.views+1)+'"^^xsd:nonNegativeInteger'  ] );
      
      rdf.modify(oldtriples,oldtriples,newtriples).then(function(results){
        console.log(newtriples);
        console.log(results);
      }).catch(function(error){
        console.log('Error :');
        console.log(error);
      });
    } 
    
    function insertArticle(article){
      
      var triples=[];
      
      //mantadory metadata
      triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.rdftype, rdf.pre.edu+'#object' ] );
      triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#url', article.url ] );
      triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#views', '"'+article.views+'"^^xsd:nonNegativeInteger'  ] );
      
      //optional metadata
      if(article.date) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#date_accepted', '"'+article.date+'"^^xsd:date' ] );
      if(article.title) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#title', '"'+encodeURIComponent(article.title)+'"^^xsd:string'  ] );
      if(article.snippet) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#snippet', '"'+encodeURIComponent(article.snippet)+'"^^xsd:string'  ] );
      if(article.lang) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#language', '"'+article.lang+'"^^xsd:string'  ] );
      if(article.wordcount) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#wordcount', '"'+article.wordcount+'"^^xsd:nonNegativeInteger'  ] );
      if(article.categories) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#categories', '"'+article.categories+'"^^xsd:string'  ] );
      if(article.source) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#source', '"'+article.source+'"^^xsd:string' ] );
      if(article.websource) triples.push( [ rdf.pre.publicUri+article.id,  rdf.pre.edu+'#websource', '"'+article.websource+'"^^xsd:string'  ] );
      if(article.altTitle) triples.push( [ rdf.pre.publicUri+article.id, rdf.pre.edu+'#alternative_title', '"'+article.altTitle+'"^^xsd:string'  ] );
        
      rdf.insert(triples).then(function(results){
        
        
        //if you insert the article start the enrichment process
        console.log(triples);
        console.log(results);
      }).catch(function(error){
        console.log('Error :');
        console.log(error);
      });
    }


    return {
      getById: getEducationalObject,
      getUserRated:getUserRatedArticles,
      getRated:getRatedArticles,
      userRated:function(){return userRatedArticles},
      rated:function(){return ratedArticles},
      insert:processArticle,
      getCurrent:function(){return curArticle}
    };
  });
