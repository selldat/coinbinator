'use strict';

module.exports = {
    db: 'mongodb://localhost/coinbinator-dev',
    app: {
        name: 'MEAN - FullStack JS - Development'
    },
    client_url: 'http://localhost:3000',
    facebook: {
        clientID: '293585657477018',
        clientSecret: 'f14cf9c6c975c1703660575dd66784d9',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
    //,
    // twitter: {
    //     clientID: 'CONSUMER_KEY',
    //     clientSecret: 'CONSUMER_SECRET',
    //     callbackURL: 'http://localhost:3000/auth/twitter/callback'
    // },
    // github: {
    //     clientID: 'APP_ID',
    //     clientSecret: 'APP_SECRET',
    //     callbackURL: 'http://localhost:3000/auth/github/callback'
    // },
    // google: {
    //     clientID: 'APP_ID',
    //     clientSecret: 'APP_SECRET',
    //     callbackURL: 'http://localhost:3000/auth/google/callback'
    // },
    // linkedin: {
    //     clientID: 'API_KEY',
    //     clientSecret: 'SECRET_KEY',
    //     callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    // }
};
