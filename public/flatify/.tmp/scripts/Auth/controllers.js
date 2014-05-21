(function() {
  'use strict';

  angular.module('app.auth.controllers', [])
    .controller('SigninController', ['$scope', '$rootScope', '$location', '$http', 'AuthService', 'AUTH_EVENTS',
      function ($scope, $rootScope, $location, $http, Auth, AUTH_EVENTS) {

        $scope.credentials = {
          email: '',
          password: ''
        };

        $scope.error = false;
        $scope.errorMessage = "";

        $scope.signin = function (credentials) {
          Auth.signin(credentials).then(
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signinSuccess, response);
              $location.path('/dashboard');
              $scope.error = false;
            }, 
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signinFailed, response);
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
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signupSuccess, response);
              $location.path('/dashboard');
              $scope.error = false;
            },
            function (response) {
              $rootScope.$broadcast(AUTH_EVENTS.signupFailed, response);
              console.log(response);
              $scope.error = true;
              $scope.errorMessage = response.data;
            }
          );
        };

      }
    ]);
}).call(this);  