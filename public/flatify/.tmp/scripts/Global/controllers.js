(function () {
  'use strict';

  angular.module('app.global.controllers', [])
    .controller('HeaderController', ['$scope', '$location', 'Session', 'AuthService', 'AUTH_EVENTS', 

      function ($scope, $location, Session, Auth, AUTH_EVENTS) {
        $scope.Auth = Auth;
        $scope.currentUser = {};

        $scope.signout = function () {
          Auth.signout().then(function () {
            Session.destroy();
            $location.path('/signin');
          });
        };

        $scope.$on(AUTH_EVENTS.signupSuccess, function (evt, msg) {
          Auth.me().then(
            function (response) {
              $scope.currentUser = response.data;
            }
          );
        });

        $scope.$on(AUTH_EVENTS.signinSuccess, function (evt, msg) {
          Auth.me().then(
            function (response) {
              console.log('me: ');
              console.log(response.data);
              $scope.currentUser = response.data;
            }
          );
        });
      }
    ]);

}).call(this);