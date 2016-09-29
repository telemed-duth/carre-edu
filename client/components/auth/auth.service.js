'use strict';

angular.module('edumaterialApp')
  .factory('Auth', function Auth($location, $rootScope, $http, $cookies, $q, $window,CONFIG) {

    var currentUser = {"guest":true};
    var token = $cookies.get(CONFIG.token_name) || false;
    
    console.log("CONFIGURATION: ", CONFIG);
    
    function authenticate(){
      return $http.get(CONFIG.api_url+'/userProfile?token='+token,{"cache":true})
      .then(function(res){
        if(!res.data.username || res.data.username.indexOf("demo")) logout();
        return res;
      },function(err){
        if(err) logout();
      });
    }
    
    function login(user, callback) {
      $window.location.href=CONFIG.auth_url+'login?next='+$location.absUrl();
    }
    function logout() {
      currentUser = {};
      $window.location.href=CONFIG.auth_url+'logout?next='+$location.absUrl();
    }

    
    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
       
      'authenticate' : authenticate,
      
      login: login,

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: logout,

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
        if(token && !currentUser.username) {
          authenticate().then(function(res){
            currentUser = res.data;
            cb(currentUser)
          })
        } else if(token && currentUser.username){
          cb(currentUser)
        } else {
          currentUser = {"guest":true};
          cb(currentUser);
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