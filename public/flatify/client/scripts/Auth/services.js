(function() {
  'use strict';

  angular.module('app.auth.services', [])
    .factory('AuthService', ['$http', 'Session',
      function ($http, Session) {
      
        return {
          signin: function (credentials) {
            return $http.post('/signin', credentials)
              .then(function (response) {
                console.log('signin response from Auth: ');
                console.log(response);
                Session.create(response.data._id);  
              });
          },
          signup: function (user) {
            console.log('user: ');
            console.log(user);
            return $http.post('/register', user)
              .then(function (response) {
                console.log('response: ');
                console.log(response);
                console.log('response.userId: ');
                console.log(response.data.userId);
                Session.create(response.data._id);  
              });
          },
          signout: function () {
            return $http.get('/signout')
              .then(function (response) {
                Session.destroy();
              });
          },
          isAuthenticated: function () {
            // console.log('Session: ');
            // console.log(Session);
            // console.log('from isAuthenticated: ');
            // console.log(Session.userId);
            return !!Session.userId;
          }
        };

      }
    ])

    .service('Session', function () {
      var self = this;

      self.create = function (userId) {
        self.userId = userId;
        console.log('self.userId: ');
        console.log(self.userId);
      };

      self.destroy = function () {
        console.log('Session.destroy() called.');
        console.log('self.userId: ');
        console.log(self.userId);
        self.userId = null;
      };

      self.getUserId = function () {
        console.log('self.userId: ');
        console.log(self.userId);
        return self.userId;
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