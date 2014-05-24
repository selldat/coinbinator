'use strict';

var mongoose = require('mongoose'),
  Account = mongoose.model('Account');

exports.me = function (req, res) {
  console.log('me called');
  console.log('req.user: ');
  console.log(req.user);
  console.log('req.user.email: ');
  console.log(req.user.email);

  Account.findOne({userEmail: req.user.email}, function (err, account) {
    console.log('err: ');
    console.log(err);
    console.log('account result: ');
    console.log(account);
    res.json({account: account});
  });
};

exports.listAll = function (req, res) {
  Account.find({}, function (err, accounts) {
    res.json({accounts: accounts});
  });
};

exports.sendMoney = function (req, res) {
  var from = req.body.from,
    to = req.body.to,
    amount = req.body.amount;

  Account.findOne({userEmail: from}, function (err, accountFrom) {
    //There is no balance to send money
    if (err) {
      return res.status(400).send(err.toString());
    }

    if (!accountFrom) {
      return res.status(404).send('not found "from" account');
    }

    if ( (accountFrom.currentBalance - amount) <= 0 ) {
      return res.status(405).send('no balance to send money');
    } 

    Account.findOneAndUpdate({userEmail: from}, {$inc: {currentBalance: -amount}}, function (err, from) {
      if (err) {
        return res.status(400).send(err.toString());
      }

      if (!from) {
        return res.status(404).send('not found "from" account ');
      }
      Account.findOneAndUpdate({userEmail: to}, {$inc: {currentBalance: amount}}, function (err, to) {
        if (err) {
          return res.status(400).send(err.toString());
        }
        if (!to) {
          return res.status(404).send('not found "to "account');
        }
        res.status(200).send({to: to, from: from});
      });
    });
  });
};

exports.loadMoney = function (req, res) {
  var userEmail = req.body.userEmail,
    amount = req.body.amount;

  if (typeof amount !== 'number') {
    return res.status(400).send(err.toString());
  }

  Account.findOneAndUpdate({userEmail: userEmail}, {$inc: {currentBalance: amount}}, function (err, account) {
    if (err) {
      return res.status(400).send(err.toString());
    }
    
    if (!account) {
      return res.status(404).send('no account found');
    }

    res.status(200).send({account: account});
  });
};