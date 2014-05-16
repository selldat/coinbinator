(function() {
  'use strict';

  angular.module('app.auth.controllers', [])
    .controller('SigninController', ['$scope', '$rootScope', 'AuthService', 'AUTH_EVENTS',
      function ($scope, $rootScope, Auth, AUTH_EVENTS) {

        $scope.credentials = {
          email: '',
          password: ''
        };

        $scope.signin = function (credentials) {
          Auth.signin(credentials).then(
            function () {
              $rootScope.$broadcast(AUTH_EVENTS.signinSuccess);
            }, 
            function () {
              $rootScope.$broadcast(AUTH_EVENTS.signinFailed);
            }
          );
        };

      }
    ])

    .controller('SignupController', ['$scope', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS',
      function ($scope, $rootScope, $location, Auth, AUTH_EVENTS) {

        $scope.user = {
          username: '',
          email: '',
          password: ''
        };

        $scope.signup = function (user) {
          Auth.signup(user).then(
            function () {
              $rootScope.$broadcast(AUTH_EVENTS.signupSuccess);
              $location.path('/dashboard');
            },
            function () {
              $rootScope.$broadcast(AUTH_EVENTS.signupFailed);
            }
          );
        };

      }
    ]);
}).call(this);  