/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Wikipedia = require('./wikipedia.model');

exports.register = function(socket) {
  Wikipedia.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Wikipedia.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('wikipedia:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('wikipedia:remove', doc);
}