(function () {
  'use strict';

  angular.module('app.global.controllers', [])
    .controller('HeaderController', ['$scope', '$rootScope', '$location', 'Session', 'AuthService', 'AUTH_EVENTS', 

      function ($scope, $rootScope, $location, Session, Auth, AUTH_EVENTS) {
        console.log('HeaderController called');
        console.log('Auth: ');
        console.log(Auth);
        $scope.Auth = Auth;

        console.log(Auth.isAuthenticated());

        $scope.signout = function () {
          Auth.signout().then(function () {
            // $rootScope.$broadcast(AUTH_EVENTS.signoutSuccess);
            Session.destroy();
            $location.path('/signin');
          });
        };

      }

    ]);

}).call(this);