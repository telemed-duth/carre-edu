'use strict';

angular.module('edumaterialApp')
  .service('rating', function (rdf,uuid4,Auth) {
    var user = Auth.getCurrentUser()?(Auth.getCurrentUser().carre?Auth.getCurrentUser().carre.graph:Auth.getCurrentUser().email):'guest_user';
    var articleRating={};
    
     function processRating(article){
       
          console.log(article);

      //check if this url already exists
      return rdf.find(
        [ 
          [ '?id', rdf.pre.rdftype, rdf.pre.edu+'#rating' ],
          [ '?id', rdf.pre.edu+'#for_article', rdf.pre.publicUri+article.id ],
          [ '?id', rdf.pre.edu+'#rated_by_user', user  ],
        ],
        ['?id'],
        ['LIMIT 1']
      ).success(function(results){
        var rating={};
            rating.article_id=article.id;
            rating.rates=article.rating;
            rating.date=new Date().toISOString();
            
          if(results.data.length>0) { //if exists
            rating.id=results.data[0].id.value.substring(53);
            //update the query , total and order 
            modifyRating(rating);
            
            
          }
          else { //create new
            rating.id=uuid4.generate();
            insertRating(rating);
          }
          return rating.id;
        }).error(function(err){
          console.log(err);
          return false;
        });
    }
    
    function modifyRating(rating){
      
      
      console.log('Modify Rating called!');
      console.log(rating);
      var oldtriples=[];
      var newtriples=[];
      
      
      //modify view
      
      oldtriples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#date', '?date' ] );
      for (var i,rc=Auth.rating_criteria;i<rc.length;i++){
        oldtriples.push([ 
          rdf.pre.publicUri+'rating/'+rating.id, 
          rdf.pre.edu+'#'+rc[i].name.replace(/\s+/g, '_').toLowerCase(), 
          '?r'  
          ]);
      }
    
      
      newtriples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#date', '"'+rating.date+'"^^xsd:date' ] );
      for (var i=0,rc=Auth.rating_criteria;i<rc.length;i++){
        
        //check if rating exists otherwise populate with 0
        if(!rating.rates[i])  rating.rates[i]={value:0};
        newtriples.push([ 
          rdf.pre.publicUri+'rating/'+rating.id, 
          rdf.pre.edu+'#'+rc[i].name.replace(/\s+/g, '_').toLowerCase(), 
          '"'+rating.rates[i].value+'"^^xsd:nonNegativeInteger'  
          ]);
      }
    
      console.log(newtriples);
      rdf.modify(oldtriples,oldtriples,newtriples).success(function(results){
        
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
      triples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#rated_by_user', user  ] );
      
      //updatable metadata
      triples.push( [ rdf.pre.publicUri+'rating/'+rating.id, rdf.pre.edu+'#date', '"'+rating.date+'"^^xsd:date' ] );
      
      //dynamic rating criteria
      for (var i=0,rc=Auth.rating_criteria;i<rc.length;i++){
        
        //check if rating exists otherwise populate with 0
        if(!rating.rates[i])  rating.rates[i]={value:0};
        triples.push([ 
          rdf.pre.publicUri+'rating/'+rating.id, 
          rdf.pre.edu+'#'+rc[i].name.replace(/\s+/g, '_').toLowerCase(), 
          '"'+rating.rates[i].value+'"^^xsd:nonNegativeInteger'  
          ]);
      }
      console.log(triples);
      
      rdf.insert(triples).success(function(results){
        
        
        console.log(results);
      }).error(function(error){
        console.log('Error :')
        console.log(error);
      });
      
    }


    return {
      insert:processRating
    };
    
    
  });
