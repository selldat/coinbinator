'use strict';

var accounts = require('../controllers/accounts'),
  accessTokens = require('../controllers/accessTokens'),
  auth = require('./middlewares/authorization');

module.exports = function (app, passport) {

  app.route('/api/accounts/me')
    .post(accounts.me);

  app.route('/api/accounts/load')
    .post(accounts.loadMoney);

  app.route('/api/accounts/send')
    .post(accounts.sendMoney);

  app.route('/api/accounts')
    .get(accounts.listAll);

};