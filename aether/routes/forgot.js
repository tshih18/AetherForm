// import express to use it
const express = require('express');
// execute express
const router = express.Router();
// import mongoose
const mongoose = require('mongoose');
// used for testing
const assert = require('assert');
// to send emails
const nodemailer = require('nodemailer');
// to generate random token for password Reset
const crypto = require('crypto');
// to avoid nesting callbacks within callbacks within callbacks
const async = require('async');

// connect with mongoose
mongoose.Promise = global.Promise;

var User = require('../model/User');

// global bc need to send emails
var email;

router.post('/', function(request, response) {

  email = request.body.email;

  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(error, buf) {
        assert.equal(null, error);
        var token = buf.toString('hex');
        done(error, token);
      });
    },
    function(token, done) {
      User.findOne({ email: email }, function(error, user) {
        assert.equal(null, error);
        if (!user) {  // display something
          return response.render('index', {forgotError: 'Invalid email'});
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(error) {
          done(error, token, user);
        });
      });
    },
    function(token, user, done) {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'aetherforms@gmail.com',
          clientId: '887921205506-qnidqf0nf9n587ubkmsrnufq05rn352j.apps.googleusercontent.com',
          clientSecret: 'ITEzdWwrOK5yBTfOMLYNejB1',
          refreshToken: '1/C6z1EyaZE9hivbOeHbaTX4_f4jUQUGkbXzP_1Lqy9Lz41UzdiqwDo-iMBoQpOXKJ',
          accessToken: 'ya29.GlvgBF6A-TA2P5FXonL5kbJjOidpv931tQJ1fLV_fzc7ImZzSheSg5ybwy7-DIMldzEEfE5d14nFUFzKbqzAyRKNGUNZzKcUNanLzlKK0zDVie3vRK5hharrjlgC'
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Aether Forms 👻" <aetherforms@gmail.com>',
        to: email,
        subject: 'Password Reset',
        text: 'You are receiving this message because a request has been sent to reset password for your account.\n\n' +
          'Please click on the following link to complete the process:\n\n' +
          'http://' + request.headers.host + '/forgotPassword/' + token + '\n\n' +
          'If you did not request this, please ignore the email and your password will remain unchanged.\n'
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        response.render('index', {Success: 'Email has been sent!'});
      });

    }
  ],
  function(error) {
    if (error) return next(error);
    response.render('index');
  });
});

router.get('/:token', function(request, response) {
  var token = request.params.token;
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(error, user) {
    assert.equal(null, error);
    if (!user) {
      return response.render('index', {Fail: 'Password reset token is invalid or has expired'});
    }
    console.log(request.user);
    response.render('resetPassword');
  });
});

router.post('/:token', function(request, response) {
  var token = request.params.token;

  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(error, user) {
        assert.equal(null, error);
        if (!user) {
          return response.render('index', {Fail: 'Password reset token is invalid or has expired'});
        }

        user.password = request.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(error) {
          //req.logIn(user, function(err) {
            done(error, user);
          //});
        });
      });
    },
    function(user, done) {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'aetherforms@gmail.com',
          clientId: '887921205506-qnidqf0nf9n587ubkmsrnufq05rn352j.apps.googleusercontent.com',
          clientSecret: 'ITEzdWwrOK5yBTfOMLYNejB1',
          refreshToken: '1/C6z1EyaZE9hivbOeHbaTX4_f4jUQUGkbXzP_1Lqy9Lz41UzdiqwDo-iMBoQpOXKJ',
          accessToken: 'ya29.GlvgBF6A-TA2P5FXonL5kbJjOidpv931tQJ1fLV_fzc7ImZzSheSg5ybwy7-DIMldzEEfE5d14nFUFzKbqzAyRKNGUNZzKcUNanLzlKK0zDVie3vRK5hharrjlgC'
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Aether Forms 👻" <aetherforms@gmail.com>',
        to: email,
        subject: 'Password Confirmation',
        text: 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        response.render('index', {Success: 'Success! Your password has changed'});
      });

    }
  ],
  function(error) {
    if (error) return next(error);
    response.render('index');
  });
});

module.exports = router;
