exports.setup = function (User, config) {
  
var passport = require('passport')
  , OpenIDStrategy = require('passport-openid').Strategy;

passport.use(new OpenIDStrategy({
    providerURL:'http://localhost:3000',
    returnURL: 'http://edu.carre-project.eu/auth/carre/callback',
    realm: 'http://edu.carre-project.eu/',
   profile: true
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));


  // passport.use(new OAuth1Strategy({
    
  //   userAuthorizationURL: config.carre.userAuthorizationURL||'http://google.com',
  //   requestTokenURL: config.carre.requestTokenURL||'http://google.com',
  //   accessTokenURL: config.carre.accessTokenURL||'http://google.com',
  //   consumerKey: config.carre.clientID,
  //   consumerSecret: config.carre.clientSecret,
  //   callbackURL: config.carre.callbackURL
  // },
  // function(token, tokenSecret, profile, done) {
  //   User.findOne({
  //     'carre.id_str': profile.id
  //   }, function(err, user) {
  //     if (err) {
  //       return done(err);
  //     }
  //     if (!user) {
  //       user = new User({
  //         name: profile.displayName,
  //         username: profile.username,
  //         role: 'user',
  //         provider: 'carre',
  //         carre: profile._json
  //       });
  //       user.save(function(err) {
  //         if (err) return done(err);
  //         return done(err, user);
  //       });
  //     } else {
  //       return done(err, user);
  //     }
  //   });
  //   }
  // ));
  
  
  
};