'use strict';

angular.module('edumaterialApp')
  .service('main', function ($q,article,rdf,rank,rating,enrichment) {
  var curArticle={};
  var curRank={};
  
  function editArticle(){
    
      $q.all([
      
      
      // add more parallel request
        article.insert(curArticle).then(function(){
          curArticle.id = article.getCurrent().id;
          curRank.article_id=curArticle.id;
          return rank.insert(curRank);
        },function(err){
          console.log(err);
        })
        
      ])
      .then(function(responses) {
        //process the results
        console.log(responses[0].data.data);
        
      
      });
  };
  
  function fetchArticles(){
     $q.all([
      
      
      // add more parallel request
        article.insert(curArticle).then(function(){
          curArticle.id = article.getCurrent().id;
          curRank.article_id=curArticle.id;
          return rank.insert(curRank);
        },function(err){
          console.log(err);
        })
        
      ])
      .then(function(responses) {
        //process the results
        console.log(responses[0].data.data);
        
      
      });
  }
  
  function exampleQuery(){
    
    var exQuery=
'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '+
'PREFIX edu: <https://carre.kmi.open.ac.uk/ontology/educational.owl#> '+
'PREFIX rdftype: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
'PREFIX dc: <http://purl.org/dc/elements/1.1/> '+
'PREFIX users: <https://carre.kmi.open.ac.uk/users/> '+

'SELECT ?title ?url ?views (count(?rating) as ?ratings) '+
'WHERE '+
'{ '+
  '?s rdf:type edu:object. '+
  '?s edu:title ?title. '+
  '?s edu:url ?url. '+
  '?s edu:views ?views. '+
  '?rating rdf:type edu:rating. '+
  '?rating edu:for_article ?s. '+
'} '

'LIMIT 100';
    
    rdf.query(exQuery).success(function(data){
      console.log('Example Query : ');
      console.log(data);
    }).error(function(err){
       console.log(err);
    }); 
    
  }
  
  return {
    setArticle:function(article){curArticle=article},
    article:function(){return curArticle},
    setRank:function(rank){curRank=rank},
    rank:function(){return curRank},
    setRating:function(r){curArticle.rating=r; rating.insert(curArticle)},
    rating:function(){return curArticle.rating},
    editArticle:editArticle,
    fetchArticles:fetchArticles,
    exampleQuery:exampleQuery
    
  }
      
  
/*    
  $q.all([
    $http.get('http://example.com/cat/' + catId),
    $http.get('http://example.com/turkey/' + turkeyId),
    $http.get('http://example.com/fish/' + fishId),
    $http.get('http://example.com/dog/' + dogId)
    .then(function(response) {
         myData.dog = response.data;
         return $http.get('http://example.com/breed/' + response.data.breed_id);
     })
     .then(function(response) {
         myData.dog.breed = response.data;
         return $http.get('http://example.com/food/' + response.data.food_id);
     })
     .then(function(response) {
         myData.dog.food = response.data;
         return myData;
     })
  ])
  .then(function(responses) {
      myData.cat = responses[0].data;
      myData.turkey = responses[1].data;
      myData.fish = responses[2].data;
  
      secondSetComplete = true;
      returnData();
  });*/



});
