'use strict';

var express = require('express');
var controller = require('./wikipedia.controller');

var router = express.Router();

router.get('/search/:term/:limit/:offset?/:lang?', controller.search);
router.get('/autocomplete/:term', controller.autocomplete);
router.get('/article/:title/:lang?', controller.article);

module.exports = router;