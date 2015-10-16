'use strict';

var express = require('express');
var controller = require('./resource.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/query', controller.query);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;