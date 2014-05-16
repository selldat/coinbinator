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
      'app.chart.directives',
      'app.auth.controllers',
      'app.auth.services',
      'app.auth.constants',
      'app.dashboard.controllers'
  ])

  .config(['$routeProvider', '$httpProvider', 
    function ($routeProvider, $httpProvider) {

      $httpProvider.interceptors.push(['$injector', 
        function ($injector) {
          return $injector.get('AuthInterceptor');
        }
      ]);

      $routeProvider
        .when('/', {
          redirectTo: '/signup'
        })
        .when('/signup', {
          templateUrl: 'views/pages/signup.html',
          controller: 'SignupController'
        })
        .when('/signin', {
          templateUrl: 'views/pages/signin.html',
          controller: 'SigninController'
        })
        .when('/dashboard', {
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardController'
        });

    }
  ])

  .run(['$rootScope', 'AUTH_EVENTS', 'AuthService', 
    function ($rootScope, AUTH_EVENTS, Auth) {
      // console.log('Auth.isAuthenticated(): ');

      // if (Auth && Auth.isAuthenticated) {
      //   console.log(Auth.isAuthenticated());  
      // }
      
      if(Auth.isAuthenticated()) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  ]);
}).call(this);