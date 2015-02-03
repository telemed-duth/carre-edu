'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  
// Accept the OpenID identifier and redirect the user to their OpenID
// provider for authentication.  When complete, the provider will redirect
// the user back to the application at:
//     /auth/openid/return

  .get('/',passport.authenticate('openid', {
    identifier:'https://carre.kmi.open.ac.uk/users/nporto',
    failureRedirect: '/signup',
    session: false
  }))
  
  
// The OpenID provider has redirected the user back to the application.
// Finish the authentication process by verifying the assertion.  If valid,
// the user will be logged in.  Otherwise, authentication has failed.

  .get('/callback', passport.authenticate('openid', {
    failureRedirect: '/signup',
    session: false
    
  }), auth.setTokenCookie);



module.exports = router;



// app.post('/login/callback',
//   passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//   function(req, res) {
//     res.redirect('/');
//   }
// );

// app.get('/login',
//   passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//   function(req, res) {
//     res.redirect('/');
//   }
// );



// router
//   .get('/', passport.authenticate('google', {
//     failureRedirect: '/signup',
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email'
//     ],
//     session: false
//   }))

//   .get('/callback', passport.authenticate('google', {
//     failureRedirect: '/signup',
//     session: false
//   }), auth.setTokenCookie);

// module.exports = router;