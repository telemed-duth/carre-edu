/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Bioportal = require('./bioportal.model');

exports.register = function(socket) {
  Bioportal.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Bioportal.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('bioportal:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('bioportal:remove', doc);
}