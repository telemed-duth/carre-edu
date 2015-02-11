var passport = require('passport'),
    request = require('request-json'),
    carreAPI = request.newClient('https://carre.kmi.open.ac.uk/ws/'),
    TokenStrategy = require('passport-token').Strategy,
    strategyOptions = {
    // usernameHeader: 'x-custom-username',
    // tokenHeader:    'x-custom-token',        
      usernameField:  'username',
      tokenField:     'oauth_token',
      passReqToCallback: true
    
    
};


// function testUsername(token){
//   console.log(token);
//       carreAPI.post('query',
//       {
//         'sparql':'select ?user{?user <http://carre.kmi.open.ac.uk/ontology/sensors.owl#has_connection> ?c }',
//         'token':token
//       },
//       function (error, response, results) {
//         if (!error && response.statusCode === 200) {
//           console.log(results);
//           if(results[0]){
//             username=results[0].user.value.substring(35);
            
//             return username;
//           } else console.log('no results');
//         } else console.log(error);
//       });       
              
// };

exports.setup = function (User, config) {
  
passport.use(new TokenStrategy(strategyOptions,
    function (req,username, token, done) {
      
      
      User.findOne({
          'name': username
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            
            user = new User({
              name: username,
              role: 'user',
              provider: 'carre',
              email: req.query.email,
              carre: {
                'oauth_token':token,
                'graph':'https://carre.kmi.open.ac.uk/users/'+username
              }
            });
            user.save(function(err) {
              if (err) return done(err);
              else return done(err, user);
            });
          } else {
            return done(err, user);
          }
        });


      
    }));
};

  
