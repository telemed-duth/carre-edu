var passport = require('passport'),
    request = require('request-json'), 
    crypto = require('crypto'),
    carreAPI = request.createClient('https://carre.kmi.open.ac.uk/ws/'),
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
                'graph':'https://carre.kmi.open.ac.uk/users/'+username,
                'gravatar': getGravatarImage(req.query.email, ".jpg?d=mm&s=96&r=G")
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

  


/**
 * Gets a gravatar image for the specified email address and optional arguments.
 * @param  {String} email The email address to get a profile image from Gravatar.
 * @param  {String} args  Arguments to append to the end of the Gravatar URL. Optional, defaults to "".
 * @return {String}       A fully qualified HREF for a gravatar image.
 */
function getGravatarImage(email, args) {
    args = args || "";
    var BASE_URL = "//www.gravatar.com/avatar/";
    // IE: //www.gravatar.com/avatar/e04f525530dafcf4f5bda069d6d59790.jpg?s=200
    return (BASE_URL + md5(email) + args).trim();
}


/**
 * MD5 hashes the specified string.
 * @param  {String} str A string to hash.
 * @return {String}     The hashed string.
 */
function md5(str) {
    str = str.toLowerCase().trim();
    var hash = crypto.createHash("md5");
    hash.update(str);
    return hash.digest("hex");
}


