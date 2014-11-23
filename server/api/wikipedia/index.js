'use strict';

var express = require('express');
var controller = require('./wikipedia.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/search/:term/:offset?', controller.search);
router.get('/autocomplete/:term', controller.autocomplete);
router.get('/article/:title', controller.article);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;