'use strict';

var express = require('express');
var controller = require('./bioportal.controller');

var router = express.Router();

router.get('/ontologies', controller.getOntologies);

module.exports = router;