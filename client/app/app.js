'use strict';
var angular=angular;
angular.module('edumaterialApp', [
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angular-loading-bar',
  'ui.select',
  'uuid4'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    // $httpProvider.interceptors.push('authInterceptor');
  })
  
  //make loading bar not show for requests smaller than 500ms
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 300;
  }])
  
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
    
  });