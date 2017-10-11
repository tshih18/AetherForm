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

var usersURL = 'mongodb://localhost:27017/users';

var didPushProblems = false;
var didPushQuestions = false;
var didPushSuggestions = false;

// makes sure only authenticated users can access page
router.get('/', function(request, response) {
  if (!request.session.user) {
    console.log("User hasent been authenticated")
    response.redirect('/');
  }
  else {
    console.log("User already authenticated");
    response.render('form');
  }
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

router.get('/logout', function(request, response) {
  request.session.destroy();
  response.render('index');
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
