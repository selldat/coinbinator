'use strict';

var should = require('should'),
  request = require('supertest'),
  server = require('../../../server.js'),
  mongoose = require('mongoose');

function deleteUsers(done) {
  mongoose.connections[0].collections['users'].remove(function () {
    deleteAccounts(done);    
  });
}

function deleteAccounts(done) {
  mongoose.connections[0].collections['accounts'].remove(function () {
    done();
  });
}

describe('Unit Test', function () {
    before(function (done) {
      deleteUsers(done);
    });

    describe('POST Register User and Account', function () {
      it('should create a user and account', function (done) {
        request(server)
          .post('/api/register')
          .send({
            email: 'user1@gmail.com',
            username: 'user1',
            password: '12345678'
          })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            var response = JSON.parse(res.text);

            response.account.should.be.ok;
            response.user.should.be.ok;

            response.account.userEmail.should.be.equal(response.user.email);
            done();
          });
      });

      it('should create another user and account', function (done) {
        request(server)
          .post('/api/register')
          .send({
            email: 'user2@gmail.com',
            username: 'user2',
            password: '12345678'
          })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            var response = JSON.parse(res.text);

            response.account.should.be.ok;
            response.user.should.be.ok;

            response.account.userEmail.should.be.equal(response.user.email);
            done();
          });
      });
    });

    describe('POST /api/accounts', function () {
      it('should load money', function (done) {
        request(server)
          .post('/api/accounts/load')
          .send({
            userEmail: 'user1@gmail.com',
            amount: 500
          })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            var response = JSON.parse(res.text);
            response.account.currentBalance.should.equal(500);
            done();
          });
      });

      it('should load money incremented by 100', function (done) {
        request(server)
          .post('/api/accounts/load')
          .send({
            userEmail: 'user1@gmail.com',
            amount: 100
          })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            var response = JSON.parse(res.text);
            response.account.currentBalance.should.equal(600);
            done();
          });
      });

      it('should get an error when loading money because the amount sent is invalid', function (done) {
        request(server)
          .post('/api/accounts/load')
          .send({
            userEmail: 'valid@gmail.com',
            amount: 'invalid amount'
          })
          .expect(400)
          .end(function (err, res) {
            done();
          });
      });

      it('should get an error when loading money because the email sent is not registered', function (done) {
        request(server)
          .post('/api/accounts/load')
          .send({
            userEmail: 'invalid@gmail.com',
            amount: 200
          })
          .expect(404)
          .end(done);
      });

      it('should get an error when sending money to another account because there is no balance', function (done) {
        request(server)
          .post('/api/accounts/send')
          .send({
            from: 'user2@gmail.com',
            to: 'user1@gmail.com',
            amount: 100
          })
          .expect(405)
          .end(done);
      });

      it('should send money to another account successfully', function (done) {
        request(server)
          .post('/api/accounts/send')
          .send({
            from: 'user1@gmail.com',
            to: 'user2@gmail.com',
            amount: 100
          })
          .end(function (err, res) {
            var response = JSON.parse(res.text);
            response.from.currentBalance.should.be.equal(500);
            response.to.currentBalance.should.be.equal(100);
            done();
          });
      });

      it('should get an error when sending money to another account because the "from" user sent is invalid', function (done) {
        request(server)
          .post('/api/accounts/send')
          .send({
            from: 'invaliduser',
            to: 'valid@gmail.com',
            amount: 100
          })
          .expect(404)
          .end(done);
      });

      it('should get an error when sending money to another account because the "to" user sent is invalid', function (done) {
        request(server)
          .post('/api/accounts/send')
          .send({
            from: 'valid@gmail.com',
            to: 'invaliduser',
            amount: 100
          })
          .expect(404)
          .end(done);
      });

      it('should get all the accounts registered', function (done) {
        request(server)
          .get('/api/accounts')
          .expect(200)
          .end(function (err, res) {
            var response = JSON.parse(res.text);
            response.accounts.should.have.length(2);
            done();
          });
      });
    });


    after(function (done) {
      deleteUsers(done);
      // done();
    });
});
