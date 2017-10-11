// import express to use it
const express = require('express');
// execute express
const router = express.Router();
// import fs library
const fs = require('fs');
// import mongodb
const mongo = require('mongodb').MongoClient;
// import mongoose
const mongoose = require('mongoose');
// get object ID
const objectID = require('mongodb').ObjectID;
// used for testing
const assert = require('assert');
// for password encryption
const bcrypt = require('bcrypt');
// for line breaks
const os = require("os");
// to send emails
const nodemailer = require('nodemailer');
// gmail authentication
const xoauth2 = require('xoauth2');
// to generate random token for password Reset
const crypto = require('crypto');
// to avoid nesting callbacks within callbacks within callbacks
const async = require('async');

// parse response body
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

// allows using jquery
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('views/index.html'));

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

var User = require('../model/User');
var Key = require('../model/Key');

var didPushProblems = false;
var didPushQuestions = false;
var didPushSuggestions = false;

// upon runinng server
console.log("server started");

var usersURL = 'mongodb://localhost:27017/users';

// connect with mongoose
mongoose.Promise = global.Promise;
mongoose.connect(usersURL);

// open all static files in folder
router.use(express.static('views'));

// GET home page.
router.get('/', function(req, res, next) {
  console.log("rendering index page");
  res.render('index');
});

/* pass value from here to javascript
router.get('/login.js', function(req, res) {
  console.log("Passing value in login.js");
  res.set('Content-Type', 'application/javascript');
  res.render('index', { name : "HELLO" });
});*/

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
  console.log(newUser);

  var passed = true;

  // check email - if email found - error
  User.findOne({email: email}, function(error, email) {
    if (email) {
      errorMessage += "Email taken";
      passed = false;
    }
  });

  // check key - if key not found - error
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
          // save user in session
          request.session.user = user;
          response.render('form');
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

var email;

router.post('/forgotPassword', function(request, response) {

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
          'http://' + request.headers.host + '/reset/' + token + '\n\n' +
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

router.get('/reset/:token', function(request, response) {
  var token = request.params.token;
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(error, user) {
    assert.equal(null, error);
    if (!user) {
      console.log('Password reset token is invalid or has expired.');
      return response.render('index');
    }
    console.log(request.user);
    response.render('resetPassword');
  });
});

router.post('/reset/:token', function(request, response) {
  var token = request.params.token;

  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(error, user) {
        assert.equal(null, error);
        if (!user) {
          console.log('Password reset token is invalid or has expired.');
          return response.render('index');
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
        subject: 'Password Reset',
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

router.post('/logout', function(request, response) {
  request.session.destroy();
  response.render('index');
});

router.get('/form', function(request, response) {
  if (!request.session.user) {
    console.log("User hasent been authenticated")
    response.redirect('/');
  }
  else {
    console.log("User already authenticated");
    response.render('form');
  }
});

// get data from database
// use post because we want to get the specific collection name to show
router.post('/getData', function(request, response) {
  var result = [];
  var name = request.body.collectionName;

  mongo.connect(usersURL, function(error, db) {
    assert.equal(null, error);
    console.log("connected to database");

    // get data under name collection
    var collection = db.collection(name);
    collection.find({}).toArray(function(error, result) {
      assert.equal(null, error);
      console.log(result);
      response.redirect('/');
      db.close();
    });
  })
});

// insert data into database
router.post('/insert', function(request, response) {
  console.log(request.body);

  // save every section in database
  var dictionarySize = Object.keys(request.body).length;
  var numOfSections = dictionarySize/2;

  // array of values
  var dictionaryData = request.body;
  // array of keys
  var dictionaryKeys = Object.keys(dictionaryData);

  // push these items in id collection
  var items = [];
  var problems = [];
  var questions = [];
  var suggestions = [];

  // will be the username to store collection
  var username = request.session.user.username;

  for (var i = 0; i < dictionarySize; i+=4) {
    var item = {
      tag: dictionaryData[dictionaryKeys[i]],
      subtag: dictionaryData[dictionaryKeys[i+1]],
      title: dictionaryData[dictionaryKeys[i+2]],
      content: dictionaryData[dictionaryKeys[i+3]]
    };

    // print item to insert
    console.log(item);
    items.push(item);

    var tagItem = {
      user: username,
      subtag: dictionaryData[dictionaryKeys[i+1]],
      title: dictionaryData[dictionaryKeys[i+2]],
      content: dictionaryData[dictionaryKeys[i+3]]
    };
    console.log(tagItem);

    // also put in tag collections
    switch(item.tag) {
      case "Problems":
        problems.push(tagItem);
        console.log("Problems pushed");
        didPushProblems = true;
        break;
      case "Questions":
        questions.push(tagItem);
        console.log("Questions pushed");
        didPushQuestions = true;
        break;
      case "Suggestions":
        suggestions.push(tagItem);
        console.log("Suggestions pushed");
        didPushSuggestions = true;
        break;
      default:
        break;
    }

  }

  response.redirect('/form');
  console.log("preparing to insert");

  // connect to mongo db db
  mongo.connect(usersURL, function(error, db) {
    assert.equal(null, error);
    console.log("connected to database");
    console.log(db);

    // insert under name under users
    db.collection(username).insert(items, function() {
      assert.equal(null, error);
      console.log("successfully inserted in " + username);
    });

    // push in tag collections
    if (didPushProblems == true) {
      db.collection("Problems").insert(problems, function() {
        assert.equal(null, error);
        console.log("Successfully inserted in Problems");
      });
    }
    if (didPushQuestions == true) {
      db.collection("Questions").insert(questions, function() {
        assert.equal(null, error);
        console.log("Successfully inserted in Questions");
      });
    }
    if (didPushSuggestions == true) {
      db.collection("Suggestions").insert(suggestions, function() {
        assert.equal(null, error);
        console.log("Successfully inserted in Suggestions");
      });
    }
    db.close();


  });

});

// delete data from database
router.delete('/deleteData', function(request, response) {

  // get collection name to delete from
  var name = request.body.collectionName;

  // get id to be deleted
  var id = request.body.id;


  mongo.connect(usersURL, function(error, db) {
    assert.equal(null, error);
    db.collection(name).deleteOne({"_id": objectID(id)}, function (error, result) {
      assert.equal(null, error);
      console.log("Item: " + id + " has been deleted");
      db.close();
    })
  });

  response.redirect('/form');

});





module.exports = router;
