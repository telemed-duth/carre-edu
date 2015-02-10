'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.get('/', function(req, res, next) {
  var callbackURL= req.protocol + '://' + req.get('host') + '/auth/carre/callback';
  console.log(callbackURL);
  var authorizationURL='https://carre.kmi.open.ac.uk/devices/accounts/login';
  res.redirect(authorizationURL+'?next='+callbackURL);
});
router.get('/callback', function(req, res, next) {
  
  passport.authenticate('token', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    var token = auth.signToken(user._id, user.role);
    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
  })(req, res, next)
});


module.exports = router;