'use strict';

var _ = require('lodash');
var Wikipedia = require('./wikipedia.model');
var request = require('request');
var bot = require('nodemw');

// pass configuration object
var wiki = new bot({    
    "server": "en.wikipedia.org",  // host name of MediaWiki-powered site
    "path": "/w",                  // path to api.php script
    "debug": false,                // is more verbose when set to true
    "username": "edu.carreproject",             // account to be used when logIn is called (optional)
    "password": "c@rr3pr0j3ct",             // password to be used when logIn is called (optional)
    "userAgent": "Api-User-Agent", // define custom bot's user agent
    "concurrency": 5              // how many API requests can be run in parallel (defaults to 3)
});


//Autocomplete suggestions on search terms
exports.autocomplete = function(req, res) {
  
  var term=req.params.term;
  
  var params={
    url:'http://en.wikipedia.org/w/api.php?action=opensearch&search='+term+'&limit=10&[[category:Diseases]]',
    json:true
  };
  
  request(params, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return res.json(200, body[1]);
    } 
  });

};



// search with terms
exports.search = function(req, res) {
  
    var term=req.params.term;
    var offset=req.params.offset;
    
    var queryParams={
      'action': 'query',
      // 'query':'srsearch='+term+'&list=search&srlimit=20&sroffset='+(offset||0)+'&[[category:Diseases]]'
      'srsearch': term+' ICD-10 -intitle:ICD-',
      'list':'search',
      'srlimit':20,
      'sroffset':offset||0
    };
    
    wiki.api.call( queryParams,function(data) {
      // console.log(queryParams);
      return res.status(200).send(data);
    });

};

// Get a single article
exports.article = function(req, res) {
  
    var title=req.params.title.split('%20').join('_');
  
    var queryParams={
      'action': 'parse',
      'page':title,
      'prop':'displayTitle|text'
    };
    
    wiki.api.call( queryParams,function(data) {
      return res.status(200).send(data);
    });

};

// Get list of wikipedias
exports.index = function(req, res) {
  Wikipedia.find(function (err, wikipedias) {
    if(err) { return handleError(res, err); }
    return res.json(200, wikipedias);
  });
};

// Get a single wikipedia
exports.show = function(req, res) {
  Wikipedia.findById(req.params.id, function (err, wikipedia) {
    if(err) { return handleError(res, err); }
    if(!wikipedia) { return res.send(404); }
    return res.json(wikipedia);
  });
};

// Creates a new wikipedia in the DB.
exports.create = function(req, res) {
  Wikipedia.create(req.body, function(err, wikipedia) {
    if(err) { return handleError(res, err); }
    return res.json(201, wikipedia);
  });
};

// Updates an existing wikipedia in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Wikipedia.findById(req.params.id, function (err, wikipedia) {
    if (err) { return handleError(res, err); }
    if(!wikipedia) { return res.send(404); }
    var updated = _.merge(wikipedia, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, wikipedia);
    });
  });
};

// Deletes a wikipedia from the DB.
exports.destroy = function(req, res) {
  Wikipedia.findById(req.params.id, function (err, wikipedia) {
    if(err) { return handleError(res, err); }
    if(!wikipedia) { return res.send(404); }
    wikipedia.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}