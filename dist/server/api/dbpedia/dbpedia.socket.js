/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Dbpedia = require('./dbpedia.model');

exports.register = function(socket) {
  Dbpedia.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Dbpedia.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('dbpedia:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('dbpedia:remove', doc);
}