// require node package modules
const express = require('express');
// used to execute express
const router = express.Router();
// used to open files
const fs = require('fs');
// import mongodb
const mongo = require('mongodb').MongoClient;
// used for mongo to organize structure of collections
const mongoose = require('mongoose');
// used to get object ID
const objectID = require('mongodb').ObjectID;
// used for testing
const assert = require('assert');
// used for password encryption
const bcrypt = require('bcrypt');
// used to parse response body
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

var usersURL = 'mongodb://localhost:27017/users';

// need to define depricated promise
mongoose.Promise = global.Promise;
// connect with mongoose once
mongoose.connect(usersURL);
//createConnection removes warnings but doesnt actually connect

var User = require('../model/User');
var Key = require('../model/Key');

// import phantom to render pdf file
var phantom = require('phantom');
var jsonURL = "http://localhost:3000/displayJSON.html";

// makes pdf super long and skinny
/*router.get('/getPDF', function(request, response) {
  phantom.create().then(function(ph) {
      ph.createPage().then(function(page) {
          page.open(jsonURL).then(function(status) {
              page.render('data.pdf').then(function() {
                page.property('viewportSize', {width: 5000, height: 5000}).then(function() {
                  console.log('Page Rendered');
                  response.redirect('/displayJSON.html');
                  ph.exit();
                })
              });
          });
      });
  });
})*/


// upon runinng server
console.log("server started");

// open all static files in folder
router.use(express.static('views'));

// GET home page.
router.get('/', function(req, res, next) {
  console.log("rendering index page");
  res.render('index');
});

// when register is pressed, redirect back to login(index)
router.post('/register', function(request, response, next) {

  var username = request.body.username;
  var email = request.body.email;
  var password = request.body.password;
  var confirmPassword = request.body.confirmPassword;
  var key = request.body.key;

  var errorMessage = "";

  //mongoose
  var newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.password = password;
  newUser.key = key;
  newUser.posts = 0;
  console.log(newUser);

  var passed = true;

  // if email is empty - error
  if (email == "") {
    errorMessage += "Email missing";
    passed = false;
  }
  // check email - if email found - error
  else {
    User.findOne({email: email}, function(error, email) {
      if (email) {
        errorMessage += "Email taken";
        passed = false;
      }
    });
  }

  if (key == "") {
    (errorMessage == "") ? errorMessage += "Key missing" : errorMessage += ", Key missing";
    passed = false;
  }
  else {
    // check key - if key not found/empty - error
    Key.findOne({key: key}, function(error, keyFound) {
      assert.equal(null, error);
      if (!keyFound) {
        (errorMessage == "") ? errorMessage += "Invalid Key" : errorMessage += ", Invalid Key";
        passed = false;
      }
    });

    // check duplicate key - if key found - error
    User.findOne({key: key}, function(error, usedKeyFound) {
      assert.equal(null, error);
      if (usedKeyFound) {
        (errorMessage == "") ? errorMessage += "Key taken" : errorMessage += ", Key taken";
        passed = false;
      }
    });

  }

  if (username == "") {
    (errorMessage == "") ? errorMessage += "Username missing" : errorMessage = "Username missing, " + errorMessage;
    passed = false;
    response.render('index', {regError: errorMessage});
  }
  else {
    // check username - if username already exists - error
    User.findOne({username: username}, function(error, username) {
      assert.equal(null, error);
      if (username) {
        (errorMessage == "") ? errorMessage += "Username taken" : errorMessage = "Username taken, " + errorMessage;
        passed = false;
      }
      if (passed) {
        newUser.save(function(error, savedUser) {
          assert.equal(null, error);
          console.log("Successfully inserted " + newUser.username);
          response.render('index', {Success: 'Registration Successful'});
        });
      }
      else {
        console.log(errorMessage);
        response.render('index', {regError: errorMessage});
      }
    });
  }
});

// when login pressed, redirect to form page
router.post('/login', function(request, response, next) {
  console.log(request.body);
  var username = request.body.username;
  var password = request.body.password;

  var errorMessage = "";

  var userInfo = {
    username: username
  };

  console.log("Preparing to check for user in database");

  User.findOne(userInfo, function(error, user) {
    assert.equal(null, error);

    if (!user) {
      console.log("Incorrect username");
      errorMessage += "Incorrect username";
      response.render('index', {logError: errorMessage});
    }
    else {
      user.comparePassword(password, function(err, isMatch) {
        // username is found
        if (isMatch && isMatch == true) {
          // save time and Date logged in
          var date = new Date();
          var ms = date.getTime();
          var month = date.getMonth()+1;  // janurary is 0
          var day = date.getDate();
          var year = date.getFullYear();
          var hour = date.getHours();
          var minute = date.getMinutes();

          var date = month + "/" + day + "/" + year;
          var time = hour + ":" + minute;

          user.dateLastActive = date;
          user.timeLastActive = time;
          user.milliSeconds = ms;

          user.save(function(error) {
            assert.equal(null, error);
            console.log("Updated time user logged in");
          });

          // save user in session
          request.session.user = user;
          if (username == "aether") {
            //response.render('dashboard');
            response.redirect('/dashboard');
          }
          else {
            response.redirect('/form');
          }

        }
        else {
          console.log("Incorrect password");
          errorMessage += "Incorrect password"
          response.render('index', {logError: errorMessage});
        }
      });
    }

  });
});


module.exports = router;
