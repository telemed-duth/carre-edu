/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Medlineplus = require('./medlineplus.model');

exports.register = function(socket) {
  Medlineplus.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Medlineplus.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('medlineplus:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('medlineplus:remove', doc);
}