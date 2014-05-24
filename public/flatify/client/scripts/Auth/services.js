(function() {
  'use strict';

  angular.module('app.auth.services', [])
    .factory('AuthService', ['$http', '$rootScope', 'Session', 'AUTH_EVENTS',
      function ($http, $rootScope, Session, AUTH_EVENTS) {
      
        return {
          getAccount: function () {
            return $http.post('/api/accounts/me')
          },
          getProfile: function () {
            return $http.post('/api/users/me');
          },
          signin: function (credentials) {
            return $http.post('/api/signin', credentials)
              .then(function (response) {
                Session.create();
                $rootScope.$broadcast(AUTH_EVENTS.signinSuccess, response);  
              });
          },
          signup: function (user) {
            return $http.post('/api/register', user)
              .then(function (response) {
                Session.create();
                $rootScope.$broadcast(AUTH_EVENTS.signupSuccess, response);
              });
          },
          signout: function () {
            return $http.get('/api/signout')
              .then(function (response) {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.signoutSuccess, response);
              });
          },
          isAuthenticated: function () {
            return Session.isLoggedIn();
          },
          ajaxIsAuthenticated: function () {
            return $http.get('/api/loggedin');
          }
        };

      }
    ])

    .service('Session', function () {
      var self = this;
      self.loggedin = false;

      self.create = function () {
        self.loggedIn = true;
      };

      self.destroy = function () {
        self.loggedIn = false;
      };

      self.isLoggedIn = function () {
        return self.loggedIn;
      }

      return self;
    })

    .factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', 
      function ($rootScope, $q, AUTH_EVENTS) {     
        return {
          responseError: function (response) {
            var status = response.status;
            if (status === 401) {
              $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
            }

            if (status === 403) {
              $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
            }

            if (status === 419 || status === 440) {
              $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, response);
            }

            return $q.reject(response);
          }
        };
      }
    ]);
}).call(this);