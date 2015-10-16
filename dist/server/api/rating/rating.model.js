'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
  resourceID: String,
  authorID: String,
  active: Boolean,
  created:Date,
  updated:Date,
  
  //rating system
  relevance:Number,
  qualityExpert:Number,
  qualityCitation:Number,
  subjectCoverage:Number,
  userRate:Number
});

module.exports = mongoose.model('Rating', RatingSchema);