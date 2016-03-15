'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  var callbackURL= req.protocol + '://' + req.get('host') + '/auth/carre/callback';
  var authorizationURL= req.protocol +'://devices.carre-project.eu/devices/accounts/login';
  res.redirect(authorizationURL+'?next='+callbackURL);
});

router.get('/cookie/:token', function(req, res, next) {
    var token=req.params.token;
    
    //get profile
    request(req.protocol+'://devices.carre-project.eu/ws/userProfile?token='+token, function (error, response, profile) {
      if (!error && response.statusCode === 200) {
      var profileObj=JSON.parse(profile);
      //add params to passport-token
      req.query={
        username:profileObj.username,
        oauth_token:token,
        email:profileObj.email
      };
      req.params.username=profileObj.username;
      req.params.email=profileObj.email;
      req.params.oauth_token=token;
      
      //add extra params
      
      passport.authenticate('token', function (err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);
        if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    
        var token = auth.signToken(user._id, user.role);
        res.cookie('token', JSON.stringify(token));
        res.redirect('/');
      })(req, res, next)
        
        
        
      }
    });

});

router.get('/callback', function(req, res, next) {
  var token=req.query.oauth_token||'';
  
  if(token){
    
    //get profile
    request(req.protocol+'://devices.carre-project.eu/ws/userProfile?token='+token, function (error, response, profile) {
      if (!error && response.statusCode === 200) {
      
      //add params to passport-token
      req.params.username=profile.username;
      req.params.oauth_token=token;
      
      //add extra params
      req.params.email=profile.email;
      
      passport.authenticate('token', function (err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);
        if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    
        var token = auth.signToken(user._id, user.role);
        res.cookie('token', JSON.stringify(token));
        res.redirect('/');
      })(req, res, next)
        
        
        
      }
    });

      
      
  }

  
});


module.exports = router;