'use strict';

var express = require('express');
var controller = require('./resource.controller');

var router = express.Router();

router.get('/elements/:type/:lang?', controller.elements);

router.post('/query', controller.query);

module.exports = router;