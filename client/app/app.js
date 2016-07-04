'use strict';
var angular=angular;
angular.module('edumaterialApp', [
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angular-loading-bar',
  'ui.select',
  'uuid4',
  'ui.gravatar'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$compileProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    // $httpProvider.interceptors.push('authInterceptor');
    
    // Disable log
    $compileProvider.debugInfoEnabled(false);
  })
  
  //make loading bar not show for requests smaller than 500ms
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 300;
  }])
  // gravatar configuration
  .config([
  'gravatarServiceProvider', function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size     : 100,
      "default": 'mm'  // Mystery man as default for missing avatars
    };

    // Use https endpoint
    gravatarServiceProvider.secure = true;

    // Force protocol
    // gravatarServiceProvider.protocol = 'carre-protocol';

    // Override URL generating function
    // gravatarServiceProvider.urlFunc = function(options) {
    //   // Code to generate custom URL
    // };
  }
])
  
  //make force reload function for ui-router
  .config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
  })
  
  //make web tokens interceptor
  // .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
  //   return {
  //     // Add authorization token to headers
  //     request: function (config) {
  //       config.headers = config.headers || {};
  //       if ($cookieStore.get('CARRE_USER')) {
  //         config.headers.Authorization = 'Bearer ' + $cookieStore.get('CARRE_USER');
  //       }
  //       return config;
  //     },

  //     // Intercept 401s and redirect you to login
  //     responseError: function(response) {
  //       if(response.status === 401) {
  //         $location.path('/login');
  //         // remove any stale tokens
  //         $cookieStore.remove('CARRE_USER');
  //         return $q.reject(response);
  //       }
  //       else {
  //         return $q.reject(response);
  //       }
  //     }
  //   };
  // })

  .run(function ($rootScope, $location, Auth, $cookies, $window) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
    
    // var carre_token = $cookies.get('CARRE_USER');
    // if(carre_token) {
    //   console.debug(carre_token);
      
    // }
    
    // handle language
    Auth.language = "en";
    if($location.search().lang) {
      Auth.language = $location.search().lang;
    }
    
    // handle embedded
    if($location.search().embed) {
      $rootScope.isEmbedded = true;
    }
    
    
  }).constant('CONFIG',{
    "api_url":"https://carre.kmi.open.ac.uk/ws/",
    "token_name":"CARRE_USER",
    "auth_url":"https://devices.carre-project.eu/devices/accounts/"
  });