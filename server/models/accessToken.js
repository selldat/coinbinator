'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  config = require('../config/config'),
  crypto = require('crypto');

var AccessTokenSchema = new Schema({
  userEmail: {type: String, required: true},
  token: {type: String, unique: true, required: true},
  created: {type: Date, 'default': Date.now}
});

AccessTokenSchema.path('token').validate(function (token) {
  return (typeof token === 'string' && token.length > 0);
}, 'AccessToken cannot be blank');

AccessTokenSchema.path('userEmail').validate(function (userEmail) {
  return (typeof userEmail === 'string' && userEmail.length > 0);
}, 'UserEmail cannot be blank');

AccessTokenSchema.methods = {
  hasExpired: function () {
    return Math.round( (Date.now()-this.created)/1000 ) > config.tokenLife;
  },
  makeSalt:  function () {
    return crypto.randomBytes(8).toString('base64');
  }
};

mongoose.model('AccessToken', AccessTokenSchema);