'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WikipediaSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Wikipedia', WikipediaSchema);