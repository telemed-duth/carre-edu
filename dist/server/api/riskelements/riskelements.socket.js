/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Riskelements = require('./riskelements.model');

exports.register = function(socket) {
  Riskelements.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Riskelements.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('riskelements:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('riskelements:remove', doc);
}