(function() {
  'use strict';

  angular.module('app.auth.constants', [])
    .constant('AUTH_EVENTS', {
      signupSuccess: 'auth-signup-success',
      signupFailed: 'auth-signup-success',
      signinSuccess: 'auth-signin-success',
      signinFailed: 'auth-signin-failed',
      signoutSuccess: 'auth-signout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    });
}).call(this);