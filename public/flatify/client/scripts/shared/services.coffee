'use strict';

angular.module("app.services", [])

.factory("AuthService", ['$http', 'Session', ($http, Session) ->
  signup: (user) ->
    $http.post('/signup', user).then (res) ->
      Session.create res.id, res.userid, res.role
      return

  signin: (credentials) ->
    $http.post("/signin", credentials).then (res) ->
      Session.create res.id, res.userid, res.role
      return

  isAuthenticated: ->
    !!Session.userId

  isAuthorized: (authorizedRoles) ->
    authorizedRoles = [authorizedRoles]  unless angular.isArray(authorizedRoles)
    @isAuthenticated() and authorizedRoles.indexOf(Session.userRole) isnt -1

.service("Session", [ ->
  @create = (sessionId, userId, userRole) ->
    @id = sessionId
    @userId = userId
    @userRole = userRole
    return

  @destroy = ->
    @id = null
    @userId = null
    @userRole = null
    return
  this
])

.factory "AuthInterceptor", ($rootScope, $q, AUTH_EVENTS) ->
  responseError: (response) ->
    $rootScope.$broadcast AUTH_EVENTS.notAuthenticated, response  if response.status is 401
    $rootScope.$broadcast AUTH_EVENTS.notAuthorized, response  if response.status is 403
    $rootScope.$broadcast AUTH_EVENTS.sessionTimeout, response  if response.status is 419 or response.status is 440
    $q.reject response