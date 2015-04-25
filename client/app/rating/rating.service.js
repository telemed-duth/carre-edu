'use strict';

angular.module('edumaterialApp')
  .service('rating', function (rdf,uuid4,Auth) {
    var articleRating={};
    var user=Auth.getCurrentUser()||{carre:{ graph:rdf.pre.users+'guestuser'}};
    
     function processRating(article){
       
      //check if this url already exists
      return rdf.find(
        [ 
          [ '?id', rdf.pre.rdftype, rdf.pre.edu+'#rating' ],
          [ '?id', rdf.pre.edu+'#for_article', rdf.pre.publicUri+article.id ],
          [ '?id', rdf.pre.edu+'#rated_by_user', user.carre.graph  ],
        ],
        ['?id'],
        ['LIMIT 1']
      ).success(function(results){
        var rating={};
            rating.article_id=article.id;
            rating.rates=article.rating;
            rating.date=new Date().toISOString();
            
          if(results.data[0] && results.data[0].id) { //if exists
            rating.id=results.data[0].id.value.substring(54);
            console.log(rating.id);
            //update the query , total and order 
            return modifyRating(rating);
            
            
          }
          else { //create new
            rating.id=uuid4.generate();
            return insertRating(rating);
          }
          // return rating.id;
        }).error(function(err){
          console.log(err);
          return false;
        });
    }    
    
     function loadRating(article){
      //check if this url already exists
      return rdf.find(
        [ 
          [ '?id', rdf.pre.rdftype, rdf.pre.edu+'#rating' ],
          [ '?article', rdf.pre.edu+'#url', article.url ],
          [ '?id', rdf.pre.edu+'#for_article', '?article'],
          [ '?id', rdf.pre.edu+'#rated_by_user', user.carre.graph  ],
          [ '?id', rdf.pre.edu+'#depth_of_coverage', '?depth_of_coverage' ],
          [ '?id', rdf.pre.edu+'#comprehensiveness', '?comprehensiveness' ],
          [ '?id', rdf.pre.edu+'#relevancy', '?relevancy' ],
          [ '?id', rdf.pre.edu+'#accuracy', '?accuracy' ],
          [ '?id', rdf.pre.edu+'#educational_level', '?educational_level' ],
          [ '?id', rdf.pre.edu+'#validity', '?validity' ]
        ],
        ['?depth_of_coverage ?comprehensiveness ?relevancy ?accuracy ?educational_level ?validity']
      );
    }
    
    function modifyRating(rating){
      
      
      console.log('Modify Rating called!');
      console.log(rating);
      var oldtriples=[];
      var newtriples=[];
      
      
      //modify view
      
      oldtriples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#date', '?date' ] );
      for (var i=0,rc=Auth.rating_criteria;i<rc.length;i++){
        if(!rating.rates[i])  rating.rates[i]={value:0};
        oldtriples.push([ 
          rdf.pre.publicUri+'rating/'+rating.id, 
          rdf.pre.edu+'#'+rc[i].name.replace(/\s+/g, '_').toLowerCase(), 
          '?ra'+i
        ]);
      }
      console.log(oldtriples);
      
      newtriples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#date', '"'+rating.date+'"^^xsd:date' ] );
      for (var i=0,rc=Auth.rating_criteria;i<rc.length;i++){
        
        //check if rating exists otherwise populate with 0
        if(rating.rates[i])  {
          if(rating.rates[i].value==0){
            newtriples.push([ 
              rdf.pre.publicUri+'rating/'+rating.id, 
              rdf.pre.edu+'#'+rc[i].name.replace(/\s+/g, '_').toLowerCase(), 
              '"'+rating.rates[i].value+'"^^xsd:nonNegativeInteger'  
              ]);
          }
        }
      }
    
      console.log(newtriples);
      return rdf.modify(oldtriples,oldtriples,newtriples).success(function(results){
        
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
    } 
    
    
    
    function insertRating(rating){
      
      console.log('Insert Rating called!');
      var triples=[];
      
      //unique metadata
      triples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.rdftype, rdf.pre.edu+'#rating' ] );
      triples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#for_article', rdf.pre.publicUri+rating.article_id ] );
      triples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#rated_by_user', user.carre.graph  ] );
      
      //updatable metadata
      triples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#date', '"'+rating.date+'"^^xsd:date' ] );
      
      //dynamic rating criteria
      for (var i=0,rc=Auth.rating_criteria;i<rc.length;i++){
        
        //check if rating exists otherwise populate with 0
        if(rating.rates[i])  {
          if(rating.rates[i].value>0){
            triples.push([ 
              rdf.pre.publicUri+'rating/'+rating.id, 
              rdf.pre.edu+'#'+rc[i].name.replace(/\s+/g, '_').toLowerCase(), 
              '"'+rating.rates[i].value+'"^^xsd:nonNegativeInteger'  
              ]);
          }
        }
      }
      
      return rdf.insert(triples).success(function(results){
        
        
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
      
    }


    return {
      insert:processRating,
      load:loadRating
    };
    
    
  });
