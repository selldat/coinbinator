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
            console.log('from routeChangeStart');
            console.log(response.data);
            if (response.data === '0') {
              if (!next.isSignin && !next.isSignup) {
                $location.path('/signin');
              }
            } else {
              $location.path('/dashboard');
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