'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    return res.redirect('/#/dashboard');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    if(req.isAuthenticated()) {
        return res.status(200).send(req.user);
        // return res.redirect('/#/dashboard');
    }
    return res.status(400).send({error: true});
    // res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.status(200).send({success: true});
};

// /**
//  * Session
//  */
// exports.session = function(req, res) {
//     res.redirect('/');
// };

/**
 * Create user
 */
exports.create = function(req, res, next) {
    console.log(req.body);
    var user = new User(req.body),
        account = new Account();

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('username', 'Username cannot be more than 20 characters').len(1,20);
    // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    // user.roles = ['authenticated'];
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send('Username/Email already taken');
                    break;
                default:
                    res.status(400).send('Please fill all the required fields');
            }

            return res.status(400);
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            account.userEmail = user.email;
            account.currentBalance = 0;
            account.save(function (err) {
              if (err) {
                res.status(400).send(err.toString());
              }
              return res.status(200).send({user: user.toObject(), account: account});  
            });
            // return res.redirect('/');
        });
        // res.status(200);
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    var credentials = null;
    if (req.user) {
        credentials = {
            user: req.user,
            token: req.token
        };
    } 

    res.jsonp(credentials);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};