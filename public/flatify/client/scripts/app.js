(function() {
  'use strict';

  angular.module('app', [
      // Angular modules
      'ngRoute',
      'ngAnimate',

      // 3rd Party Modules
      'ui.bootstrap',
      'easypiechart',
      'mgo-angular-wizard',
      'textAngular',

      // Custom modules
      'app.global.controllers',
      'app.account.controllers',
      'app.ui.ctrls',
      'app.ui.directives',
      'app.ui.services',
      'app.controllers',
      'app.directives',
      'app.form.validation',
      'app.ui.form.ctrls',
      'app.ui.form.directives',
      'app.tables',
      'app.task',
      'app.localization',
      'app.chart.ctrls',
      'app.dashboard.controllers',
      'app.chart.directives',
      'app.auth.controllers',
      'app.auth.services',
      'app.auth.constants'
  ])

  .config(['$routeProvider', '$httpProvider', 
    function ($routeProvider, $httpProvider) {

      $httpProvider.interceptors.push(['$injector', 
        function ($injector) {
          return $injector.get('AuthInterceptor');
        }
      ]);

      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.defaults.withCredentials = true;

      $routeProvider
        .when('/', {
          redirectTo: '/signin'
        })
        .when('/signup', {
          templateUrl: 'views/pages/signup.html',
          controller: 'SignupController',
          isSignup: true
        })
        .when('/signin', {
          templateUrl: 'views/pages/signin.html',
          controller: 'SigninController',
          isSignin: true
        })
        .when('/dashboard', {
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardController'
        })
        .when('/account/me', {
          templateUrl: 'views/account/my-account.html',
          controller: 'AccountController'
        })
        .when('/account/load', {
          templateUrl: 'views/account/load-money.html',
          controller: 'AccountController'
        })
        .when('/account/send', {
          templateUrl: 'views/account/send-money.html',
          controller: 'AccountController'
        })
        .otherwise({
          redirectTo: '/'
        });

    }
  ])

  .run(['$rootScope', '$location', 'Session', 'AUTH_EVENTS', 'AuthService', 
    function ($rootScope, $location, Session, AUTH_EVENTS, Auth) {
      $rootScope.$on('$routeChangeStart', function (event, next) {
        Auth.ajaxIsAuthenticated().then(
          //success
          function (response) {
            if (response.data === '0') {
              if (!next.isSignin && !next.isSignup) {
                $location.path('/signin');
              }
            } 
            else {
              console.log($location.path());
              console.log($location.path().indexOf('/signin') >= 0);
              if ($location.path().indexOf('/signin') >= 0 || $location.path().indexOf('/signup') >= 0) {
                $location.path('/dashboard');
              }
              console.log($location.path());
              Session.create();
              $rootScope.$broadcast(AUTH_EVENTS.signinSuccess, response);
            }
          },
          //error
          function (response) {
            console.log('error response from routeChangeStart: ')
            console.log(response);
          }
        );
      });
    }
  ]);
}).call(this);