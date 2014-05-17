(function() {
  'use strict';

  angular.module('app.auth.controllers', [])
    .controller('SigninController', ['$scope', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS',
      function ($scope, $rootScope, $location, Auth, AUTH_EVENTS) {

        $scope.credentials = {
          email: '',
          password: ''
        };

        $scope.error = false;
        $scope.errorMessage = "";

        $scope.signin = function (credentials) {
          Auth.signin(credentials).then(
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signinSuccess);
              $location.path('/dashboard');
              $scope.error = false;
            }, 
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signinFailed);
              console.log(response);
              $scope.error = true;
              $scope.errorMessage = response.data;
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

        $scope.error = false;
        $scope.errorMessage = "";

        $scope.signup = function (user) {
          Auth.signup(user).then(
            function () {
              $rootScope.$broadcast(AUTH_EVENTS.signupSuccess);
              $location.path('/dashboard');
              $scope.error = false;
            },
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signupFailed);
              console.log(response);
              $scope.error = true;
              $scope.errorMessage = response.data;
            }
          );
        };

      }
    ]);
}).call(this);  