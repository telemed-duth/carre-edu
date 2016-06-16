'use strict';

var express = require('express');
var controller = require('./medlineplus.controller');

var router = express.Router();

// router.get('/term/:term', controller.medlineTerm);
router.get('/query/:q', controller.medlineQuery);

module.exports = router;