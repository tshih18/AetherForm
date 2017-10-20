// import express to use it
const express = require('express');
// execute express
const router = express.Router();
// import mongodb
const mongo = require('mongodb').MongoClient;
// import mongoose
const mongoose = require('mongoose');
// used for testing
const assert = require('assert');

// save url where to connect and save data
var usersURL = 'mongodb://localhost:27017/users';

// get objects from mongoose object model
var User = require('../model/User');
var Problem = require('../model/Problem');
var Question = require('../model/Question');
var Suggestion = require('../model/Suggestion');

// makes sure only authenticated users can access page
router.get('/', function(request, response) {
  if (!request.session.user) {
    console.log("User hasent been authenticated");
    return response.redirect('/');
  }
  else {
    console.log("User already authenticated");
     return response.render('form');
  }
});

// insert data into database
router.post('/insert', function(request, response) {
  // save every section in database
  var dictionarySize = Object.keys(request.body).length;
  var numOfSections = dictionarySize/2;

  var dictionaryData = request.body;
  var dictionaryKeys = Object.keys(dictionaryData);

  // push these items in id collection
  var items = [];

  // will be the username to store collection
  var username = request.session.user.username;

  for (var i = 0; i < dictionarySize; i+=4) {
    // save time and Date inserted
    var now = new Date();
    // want milliSeconds to be unique bc they will be keys in dictionary
    var ms = now.getTime()+1; // make unique in case same time
    var month = now.getMonth()+1;  // janurary is 0
    var day = now.getDate();
    var year = now.getFullYear();
    var hour = now.getHours();
    var minute = now.getMinutes();

    var date = month + "/" + day + "/" + year;
    var time;

    // AM
    if (hour < 12) {
      // if hour == 0, 12AM
      if (hour == 0) {
        hour = 12;
      }

      // fix single digit minutes '0#'
      if (minute < 10) {
        time = hour + ":0" + minute + "AM";
      }
      else {
        time = hour + ":" + minute + "AM";
      }
    }
    // PM
    else {
      if (hour != 12) {
        hour = hour - 12;
      }

      // fix single digit minutes '0#'
      if (minute < 10) {
        time = hour + ":0" + minute + "PM";
      }
      else {
        time = hour + ":" + minute + "PM";
      }
    }

    // object to be inserted in user collection
    var item = {
      tag: dictionaryData[dictionaryKeys[i]],
      subtag: dictionaryData[dictionaryKeys[i+1]],
      title: dictionaryData[dictionaryKeys[i+2]],
      content: dictionaryData[dictionaryKeys[i+3]],
      date: date,
      time: time,
      milliSeconds: ms
    };

    console.log(item);
    items.push(item);

    // also put in tag collections
    switch(item.tag) {
      case "Problems":
        var newProblem = new Problem();
        newProblem.user = username;
        newProblem.subtag = dictionaryData[dictionaryKeys[i+1]];
        newProblem.title = dictionaryData[dictionaryKeys[i+2]];
        newProblem.content = dictionaryData[dictionaryKeys[i+3]];
        newProblem.date = date;
        newProblem.time = time;
        newProblem.milliSeconds = ms;
        newProblem.save(function(error) {
          assert.equal(null, error);
          console.log("Problems saved");
        });
        break;
      case "Questions":
        var newQuestion = new Question();
        newQuestion.user = username;
        newQuestion.subtag = dictionaryData[dictionaryKeys[i+1]];
        newQuestion.title = dictionaryData[dictionaryKeys[i+2]];
        newQuestion.content = dictionaryData[dictionaryKeys[i+3]];
        newQuestion.date = date;
        newQuestion.time = time;
        newQuestion.milliSeconds = ms;
        newQuestion.save(function(error) {
          assert.equal(null, error);
          console.log("Questions saved");
        });
        break;
      case "Suggestions":
        var newSuggestion = new Suggestion();
        newSuggestion.user = username;
        newSuggestion.subtag = dictionaryData[dictionaryKeys[i+1]];
        newSuggestion.title = dictionaryData[dictionaryKeys[i+2]];
        newSuggestion.content = dictionaryData[dictionaryKeys[i+3]];
        newSuggestion.date = date;
        newSuggestion.time = time;
        newSuggestion.milliSeconds = ms;
        newSuggestion.save(function(error) {
          assert.equal(null, error);
          console.log("Suggestions saved");
        });
        break;
      default:
        break;
    }
  }

  // update number of posts
  User.findOne({username: request.session.user.username}, function(error, user) {
    assert.equal(null, error);
    user.posts += items.length;

    user.save(function(error) {
      assert.equal(null, error);
      console.log("Successfully updated number of posts");
    });
  });

  // save collection under their username
  mongo.connect(usersURL, function(error, db) {
    assert.equal(null, error);
    console.log("connected to database");
    console.log(db);

    // insert under name under users
    db.collection(username).insert(items, function() {
      assert.equal(null, error);
      console.log("successfully inserted in " + username);
    });
    db.close();
    response.render('form', {message: 'Success! Form has been submitted'})
  });
});

router.get('/logout', function(request, response) {
  // find user to update time and date last active
  User.findOne({username: request.session.user.username}, function(error, user) {
    assert.equal(null, error);

    var now = new Date();
    var ms = now.getTime();
    var month = now.getMonth()+1;  // janurary is 0
    var day = now.getDate();
    var year = now.getFullYear();
    var hour = now.getHours();
    var minute = now.getMinutes();

    var date = month + "/" + day + "/" + year;
    var time;

    // AM
    if (hour < 12) {
      // if hour == 0, 12AM
      if (hour == 0) {
        hour = 12;
      }

      // fix single digit minutes '0#'
      if (minute < 10) {
        time = hour + ":0" + minute + "AM";
      }
      else {
        time = hour + ":" + minute + "AM";
      }
    }
    // PM
    else {
      if (hour != 12) {
        hour = hour - 12;
      }

      // fix single digit minutes '0#'
      if (minute < 10) {
        time = hour + ":0" + minute + "PM";
      }
      else {
        time = hour + ":" + minute + "PM";
      }
    }

    user.dateLastActive = date;
    user.timeLastActive = time;
    user.milliSeconds = ms;

    user.save(function(error) {
      assert.equal(null, error);
      console.log("Updated last time user was active");
    })

  });

  request.session.destroy();
  response.redirect('/');
});

/* get data from database
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
*/

/* delete data from database
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
*/

module.exports = router;
