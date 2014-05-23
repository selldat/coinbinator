'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    accessTokens = require('../controllers/accessTokens'),
    auth = require('./middlewares/authorization');

module.exports = function(app, passport) {

    app.route('/api/signout')
        .get(users.signout);
    
    app.route('/api/users/me')
        .post(accessTokens.exists, users.me);

    // Setting up the users api
    app.route('/api/register')
        .post(users.create);

    app.route('/auth/token')
        .post(accessTokens.create, function(req, res) {
            if (req.token) {
                return res.status(200).send(req.token);
            }
            return res.status(400).send('no token generated');
        });

    // Setting up the userId param
    app.param('userId', users.user);

    // AngularJS route to check for authentication
    app.route('/api/loggedin')
        .get(accessTokens.exists, function(req, res) {
            res.send(req.token ? req.user : '0');
        });

    // Setting the local strategy route
    app.route('/api/signin')
        .post(passport.authenticate('local', {
            failureFlash: true,
            session: false
        }), function(req, res) {
            res.send(req.user);
        });

    // // Setting the facebook oauth routes
    // app.route('/auth/facebook')
    //     .get(passport.authenticate('facebook', {
    //         scope: ['email', 'user_about_me'],
    //         failureRedirect: '#/signin'
    //     }), users.signin);

        // Setting the facebook oauth routes
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', {
            scope: ['email', 'user_about_me']
        }), users.signin);


    // app.route('/auth/facebook/callback')
    //     .get(passport.authenticate('facebook', {
    //         failureRedirect: '#/signin',
    //         successRedirect: '#/dashboard'
    //     }), users.authCallback);

    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook'), users.authCallback);

    // // Setting the github oauth routes
    // app.route('/auth/github')
    //     .get(passport.authenticate('github', {
    //         failureRedirect: '#!/login'
    //     }), users.signin);

    // app.route('/auth/github/callback')
    //     .get(passport.authenticate('github', {
    //         failureRedirect: '#!/login'
    //     }), users.authCallback);

    // // Setting the twitter oauth routes
    // app.route('/auth/twitter')
    //     .get(passport.authenticate('twitter', {
    //         failureRedirect: '#!/login'
    //     }), users.signin);

    // app.route('/auth/twitter/callback')
    //     .get(passport.authenticate('twitter', {
    //         failureRedirect: '#!/login'
    //     }), users.authCallback);

    // // Setting the google oauth routes
    // app.route('/auth/google')
    //     .get(passport.authenticate('google', {
    //         failureRedirect: '#!/login',
    //         scope: [
    //             'https://www.googleapis.com/auth/userinfo.profile',
    //             'https://www.googleapis.com/auth/userinfo.email'
    //         ]
    //     }), users.signin);

    // app.route('/auth/google/callback')
    //     .get(passport.authenticate('google', {
    //         failureRedirect: '#!/login'
    //     }), users.authCallback);

    // // Setting the linkedin oauth routes
    // app.route('/auth/linkedin')
    //     .get(passport.authenticate('linkedin', {
    //         failureRedirect: '#!/login',
    //         scope: ['r_emailaddress']
    //     }), users.signin);

    // app.route('/auth/linkedin/callback')
    //     .get(passport.authenticate('linkedin', {
    //         failureRedirect: '#!/login'
    //     }), users.authCallback);

};