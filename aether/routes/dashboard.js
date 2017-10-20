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

// get objects from mongoose object model
var User = require('../model/User');
var Problem = require('../model/Problem');
var Question = require('../model/Question');
var Suggestion = require('../model/Suggestion');

router.get('/', function(request, response) {
  // check if user is authenticated
  if (!request.session.user) {
    console.log("User hasent been authenticated")
    //response.render('index');
    return response.redirect('/');
  }

  var usernames = [];

  var metaObj = {};
  var metaObjStr;

  var problemObj = [];
  var problemObjStr;

  var questionObj = [];
  var questionObjStr;

  var suggestionObj = [];
  var suggestionObjStr;

  // fetch users and their metadata
  User.find({}, function(error, users) {
    assert.equal(null, error);
    users.forEach(function(user) {
      if (user.username != "aether") {
        usernames.push([user.username, user.milliSeconds]);
        var data = {
          "email": user.email,
          "key": user.key,
          "posts": user.posts,
          "dateLastActive": user.dateLastActive,
          "timeLastActive": user.timeLastActive
        }
        metaObj[user.username] = data;
      }
    });
    metaObjStr = JSON.stringify(metaObj);
  });

  // fetch problems
  Problem.find({}, function(error, problems) {
    assert.equal(null, error);
    problems.forEach(function(problem) {
      var data = {
        "user": problem.user,
        "subtag": problem.subtag,
        "title": problem.title,
        "content": problem.content,
        "date": problem.date,
        "time": problem.time,
        "milliSeconds": problem.milliSeconds
      };
      problemObj.push(data);

    });
    problemObjStr = JSON.stringify(problemObj);
  });

  // fetch questions
  Question.find({}, function(error, questions) {
    assert.equal(null, error);
    questions.forEach(function(question) {
      var data = {
        "user": question.user,
        "subtag": question.subtag,
        "title": question.title,
        "content": question.content,
        "date": question.date,
        "time": question.time,
        "milliSeconds": question.milliSeconds
      };
      questionObj.push(data);

    });
    questionObjStr = JSON.stringify(questionObj);
  });

  // fetch suggestions
  Suggestion.find({}, function(error, suggestions) {
    assert.equal(null, error);
    suggestions.forEach(function(suggestion) {
      var data = {
        "user": suggestion.user,
        "subtag": suggestion.subtag,
        "title": suggestion.title,
        "content": suggestion.content,
        "date": suggestion.date,
        "time": suggestion.time,
        "milliSeconds": suggestion.milliSeconds
      };
      suggestionObj.push(data);
    });
    suggestionObjStr = JSON.stringify(suggestionObj);

    // render dashboard page and pass data to html template
    response.render('dashboard', {user: usernames, metadata: metaObjStr, problem: problemObjStr, question: questionObjStr, suggestion: suggestionObjStr});
  });

});

router.post('/reply', function(request, response) {
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

  // setup email data
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

    response.redirect('/dashboard');
  });



});

router.get('/logout', function(request, response) {
  request.session.destroy();
  response.redirect('/');
});


module.exports = router;
