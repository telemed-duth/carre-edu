'use strict';

angular.module('edumaterialApp')
  .service('rank', function (rdf,uuid4, CONFIG) {
    
    function processRank(rank){
      
      //check if this url already exists
      return rdf.find(
        [ 
          [ '?id', rdf.pre.rdftype, rdf.pre.edu+'#rank' ],
          [ '?id', rdf.pre.edu+'#for_article', rdf.pre.publicUri+rank.article_id ],
          [ '?id', rdf.pre.edu+'#query', '"'+rank.query+'"^^xsd:string'  ],
        ],
        ['?id'],
        ['LIMIT 1']
      ).then(function(results){
        
          if(results.data.length>0) { //if exists
            rank.id=results.data[0].id.value.substring(52);
            
            //update the query , total and order 
            modifyRank(rank);
            
            
          }
          else { //create new
            rank.id=uuid4.generate();
            insertRank(rank);
          }
          
          //link the current risk element with the article
          insertRiskElement(rank);
          
          return rank.id;
        },function(err){
          console.log(err);
          return false;
        });
    }
    
    function modifyRank(rank){
      
      
      console.log('Modify Rank called!');
      var oldtriples=[];
      var newtriples=[];
      
      //modify view
      oldtriples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#date', '?date' ] );
      oldtriples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#total', '?total'  ] );
      oldtriples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#total', '?pos'  ] );
    
      
      //updatable metadata
      newtriples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#date', '"'+rank.date+'"^^xsd:date' ] );
      newtriples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#total', '"'+rank.total+'"^^xsd:nonNegativeInteger'  ] );
      newtriples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#total', '"'+rank.position+'"^^xsd:nonNegativeInteger'  ] );
    
      rdf.modify(oldtriples,oldtriples,newtriples).then(function(results){
        
        console.log(results);
      }).catch(function(error){
        console.log('Error :')
        console.log(error);
      });
    } 
    
    function insertRank(rank){
      
      console.log('Insert Rank called!');
      var triples=[];
      
      //unique metadata
      triples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.rdftype, rdf.pre.edu+'#rank' ] );
      triples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#for_article', rdf.pre.publicUri+rank.article_id ] );
      triples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#query', '"'+rank.query+'"^^xsd:string'  ] );
      
      //updatable metadata
      triples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#date', '"'+rank.date+'"^^xsd:date' ] );
      triples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#total', '"'+rank.total+'"^^xsd:nonNegativeInteger'  ] );
      triples.push( [ rdf.pre.publicUri+'rank/'+rank.id, rdf.pre.edu+'#position', '"'+rank.position+'"^^xsd:nonNegativeInteger'  ] );
        
      rdf.insert(triples).then(function(results){
        
        
        console.log(results);
      }).catch(function(error){
        console.log('Error :')
        console.log(error);
      });
    }
    
    function insertRiskElement(rank){
      
      console.log('Insert Risk Element called!');
      var triples=[];
      if(rank.article_risk) triples.push( [ rank.article_risk, 'http://'+CONFIG.graph_url+'/ontology/risk.owl#has_educational_material', rdf.pre.publicUri+rank.article_id  ] );

        
      rdf.insert(triples).then(function(results){
        
        
        console.log(results);
      }).catch(function(error){
        console.log('Error :')
        console.log(error);
      });
    }


    return {
      insert:processRank
    };
    
  });
