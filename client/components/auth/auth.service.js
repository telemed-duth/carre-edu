'use strict';

angular.module('edumaterialApp')
  .factory('Auth', function Auth($location, $rootScope, $http, $cookies, $q, $window,CONFIG) {
    var currentUser = {};
    var token = $cookies.get(CONFIG.token_name) || false;
    authenticate();
    console.log("CONFIGURATION: ", CONFIG);
    
    function authenticate() {
      if(token&&!currentUser.username) {
        currentUser=$http.get(CONFIG.api_url+'/userProfile?token='+token,{"cache":true}).then(function(res){
          currentUser = res.data;
          console.debug("CARRE USER exists:",currentUser);
        },function(err) { console.error("Authentication error: ",err); this.logout(); });
        console.debug("CARRE token exists:",$cookies.get('CARRE_USER'))
      }
    }
    
    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
       
      authenticate : authenticate,
      
      login: function(user, callback) {
        $window.location.href=CONFIG.auth_url+'login?next='+$location.absUrl();
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        currentUser = {};
        $window.location.href=CONFIG.auth_url+'logout?next='+$location.absUrl();
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('username');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('username')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },
      
      isMedicalExpert: function() {
        return currentUser.role === 'medical_expert';
      },

      /**
       * Get auth token
       */
      token: token
      
    };
  });
