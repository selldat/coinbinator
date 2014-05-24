(function () {
  'use strict';

  angular.module('app.global.controllers', [])
    .controller('ApplicationController', ['$scope', 'AuthService', 'AUTH_EVENTS',
      function ($scope, Auth, AUTH_EVENTS) {
        $scope.Auth = Auth;
        $scope.currentUser = {};
        $scope.currentAccount = {};
        $scope.main = {
          brand: 'Coinbinator'
        };

        function getProfile($scope) {
          Auth.getProfile().then(
            function (response) {
              $scope.currentUser = response.data.user;
              $scope.currentUser.photo = response.data.user.facebook && response.data.user.facebook.picture.data.url || 'images/profile.jpg';
            }
          );
        }

        function getAccount($scope) {
           Auth.getAccount().then(
            function (response) {
              console.log
              $scope.currentAccount = response.data.account;
            }
          );
        }

        $scope.$on(AUTH_EVENTS.signupSuccess, function (evt, msg) {
          console.log('AUTH_EVENTS.signupSuccess called');
          getProfile($scope);
          getAccount($scope);
        });

        $scope.$on(AUTH_EVENTS.signinSuccess, function (evt, msg) {
          console.log('AUTH_EVENTS.signinSuccess called');
          getProfile($scope);
          getAccount($scope);
        });
      } 
    ])

    .controller('HeaderController', ['$scope', '$location', 'Session', 'AuthService', 'AUTH_EVENTS', 
      function ($scope, $location, Session, Auth, AUTH_EVENTS) {
        $scope.signout = function () {
          Auth.signout().then(function () {
            Session.destroy();
            $location.path('/signin');
          });
        };
      }
    ]);

}).call(this);