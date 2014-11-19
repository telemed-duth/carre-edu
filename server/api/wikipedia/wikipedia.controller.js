'use strict';

var _ = require('lodash');
var Wikipedia = require('./wikipedia.model');

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