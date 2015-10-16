'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RiskelementsSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Riskelements', RiskelementsSchema);