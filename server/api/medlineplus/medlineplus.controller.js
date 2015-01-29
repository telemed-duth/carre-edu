'use strict';

var _ = require('lodash');
var Medlineplus = require('./medlineplus.model');
var parseString = require('xml2js').parseString;
var request = require('request');




// Get a single medline
exports.medlineTerm = function(req, res) {
  var term=req.params.term;
  
  //now run query
  request('http://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term='+term+'&rettype=brief', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      //now the body var holds results in xml
      parseString(body, function (err, result) {
        if(result.nlmSearchResult.count>0) {
          var pretty={};
          pretty.term=result.nlmSearchResult.term;
          pretty.count=result.nlmSearchResult.count;
          pretty.retstart=result.nlmSearchResult.retstart;
          pretty.retmax=result.nlmSearchResult.retmax;
          pretty.list=result.nlmSearchResult.list[0].document.map(function(d){
            var n={};
            n.rank=d.$.rank;
            n.url=d.$.url;
            for (var i = 0,l=d.content.length; i < l; i++) {
              n[d.content[i].$.name]=d.content[i]._;
            }
            return n;
          });
          return res.json(200, pretty);
        } else return res.json(200, {'message':'no_results','data':result});
      });
    } 
      
  });

};


// Get a single medline
exports.medlineQuery = function(req, res) {
  var q=req.params.q;
  
  //now run query
  request('http://wsearch.nlm.nih.gov/ws/query?'+q, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      //now the body var holds results in xml
      
      // return res.status(200).send(body);
      parseString(body, function (err, result) {
        if(result.nlmSearchResult.count>0) {
          var pretty={};
          pretty.term=result.nlmSearchResult.term;
          pretty.count=result.nlmSearchResult.count;
          pretty.retstart=result.nlmSearchResult.retstart;
          pretty.retmax=result.nlmSearchResult.retmax;
          pretty.list=result.nlmSearchResult.list[0].document.map(function(d){
            var n={};
            n.rank=d.$.rank;
            n.url=d.$.url;
            for (var i = 0,l=d.content.length; i < l; i++) {
              n[d.content[i].$.name]=d.content[i]._;
            }
            return n;
          });
          return res.json(200, pretty);
        } else return res.json(200, {'message':'no_results','data':result});
      });
      
    } 
      
  });

};















//boilerplate


// Get list of medlinepluss
exports.index = function(req, res) {
  Medlineplus.find(function (err, medlinepluss) {
    if(err) { return handleError(res, err); }
    return res.json(200, medlinepluss);
  });
};

// Get a single medlineplus
exports.show = function(req, res) {
  Medlineplus.findById(req.params.id, function (err, medlineplus) {
    if(err) { return handleError(res, err); }
    if(!medlineplus) { return res.send(404); }
    return res.json(medlineplus);
  });
};

// Creates a new medlineplus in the DB.
exports.create = function(req, res) {
  Medlineplus.create(req.body, function(err, medlineplus) {
    if(err) { return handleError(res, err); }
    return res.json(201, medlineplus);
  });
};

// Updates an existing medlineplus in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Medlineplus.findById(req.params.id, function (err, medlineplus) {
    if (err) { return handleError(res, err); }
    if(!medlineplus) { return res.send(404); }
    var updated = _.merge(medlineplus, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, medlineplus);
    });
  });
};

// Deletes a medlineplus from the DB.
exports.destroy = function(req, res) {
  Medlineplus.findById(req.params.id, function (err, medlineplus) {
    if(err) { return handleError(res, err); }
    if(!medlineplus) { return res.send(404); }
    medlineplus.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}