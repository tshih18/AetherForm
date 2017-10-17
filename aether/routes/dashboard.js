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

router.get('/logout', function(request, response) {
  request.session.destroy();
  response.redirect('/');
});


module.exports = router;
