'use strict';

var express = require('express');
var controller = require('./riskelements.controller');

var router = express.Router();

router.get('/:lang?', controller.riskElements);

module.exports = router;