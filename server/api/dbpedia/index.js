'use strict';

var express = require('express');
var controller = require('./dbpedia.controller');

var router = express.Router();

router.get('/term/:term/:lang?', controller.dbpediaQuery);

module.exports = router;