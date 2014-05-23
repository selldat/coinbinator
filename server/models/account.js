'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AccountSchema = new Schema({
  userEmail: {type: String},
  currentBalance: {type: Number}
});

AccountSchema.path('userEmail').validate(function (userEmail) {
  return (typeof userEmail === 'string' && userEmail.length > 0);
});

mongoose.model('Account', AccountSchema);