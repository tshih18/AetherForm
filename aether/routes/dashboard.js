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
// used to parse response body
const bodyParser = require('body-parser');

// connect with mongoose
mongoose.Promise = global.Promise;

var User = require('../model/User');
var Problem = require('../model/Problem');
var Question = require('../model/Question');
var Suggestion = require('../model/Suggestion');

router.get('/', function(request, response) {
  var usernames = [];
  var metadata = [];
  var problemData = [];
  var questionData = [];
  var suggestionData = [];

  // fetch users and their metadata
  User.find({}, function(error, users) {
    assert.equal(null, error);
    users.forEach(function(user) {
      if (user.username != "aether") {
        usernames.push([user.username, user.milliSeconds]);
        metadata.push([user.username, user.email, user.key, user.posts, user.dateLastActive, user.timeLastActive]);
      }
    });
  });

  // fetch problems
  Problem.find({}, function(error, problems) {
    assert.equal(null, error);
    problems.forEach(function(problem) {
      problemData.push([problem.user, problem.subtag, problem.title, problem.content, problem.date, problem.time, problem.milliSeconds]);
    });
  });

  // fetch questions
  Question.find({}, function(error, questions) {
    assert.equal(null, error);
    questions.forEach(function(question) {
      questionData.push([question.user, question.subtag, question.title, question.content, question.date, question.time, question.milliSeconds]);
    });
  });

  // fetch suggestions
  Suggestion.find({}, function(error, suggestions) {
    assert.equal(null, error);
    suggestions.forEach(function(suggestion) {
      suggestionData.push([suggestion.user, suggestion.subtag, suggestion.title, suggestion.content, suggestion.date, suggestion.time, suggestion.milliSeconds]);
    });

    response.render('dashboard', {user: usernames, metadata: metadata, problem: problemData, question: questionData, suggestion: suggestionData});
  });

});

router.post('/reply', function(request, response) {
  console.log(request.body.replyTitle);
  console.log(request.body.replyEmail);
  console.log(request.body.replyContent);
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
    to: request.body.replyEmail,
    subject: request.body.replyTitle,
    text: request.body.replyContent
  };
  
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    //response.render('index', {Success: 'Email has been sent!'});
    response.redirect('/dashboard');
  });



});

router.get('/logout', function(request, response) {
  request.session.destroy();
  response.redirect('/');
});


module.exports = router;
