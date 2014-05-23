'use strict';

var mongoose = require('mongoose'),
  AccessToken = mongoose.model('AccessToken'),
  User = mongoose.model('User');

exports.create = function (req, res, next) {
  var email = req.body.email,
    password = req.body.password;

  User.findOne({email: email}, function (err, user) {
    if (err) {
      return res.status(400).send(err.toString());
    }

    if (!user) {
      return res.status(404).send('no user found');
    }

    if (!user.authenticate(password)) {
      return res.status(404).send('invalid password');
    }

    AccessToken.findOneAndRemove({userEmail: email}, function (err, accessToken) {
      if (err) {
        return res.status(400).send(err.toString());
      }

      var newToken = new AccessToken({userEmail: email});
      newToken.token = newToken.makeSalt();

      newToken.save(function (err) {
        if (err) {
          return res.status(400).send(err.toString());
        }
        req.token = newToken;
        next();
      });
    });
  });
};

exports.exists = function (req, res, next) {
  var tokenValue = req.headers['token'];

  AccessToken.findOne({token: tokenValue}, function (err, accessToken) {
    if (err) {
      return res.status(400).send(err.toString());
    }

    if (!accessToken) {
      return res.status(404).send({error: 'No access token found'});
    }

    if (accessToken.hasExpired()) {
      AccessToken.remove({token: accessToken.token}, function (err) {
        if (err) {
          return res.status(400).send(err.toString());
        }

        return res.status(400).send({error: 'The access token has expired, you should renew it.'});
      });
    } else {
      req.token = accessToken;
      next();
    }
  });
};

