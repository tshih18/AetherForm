// import express to use it
var express = require('express');
// execute express
var router = express.Router();
// import fs library
var fs = require('fs');
// import mongodb
var mongo = require('mongodb').MongoClient;
// get object ID
var objectID = require('mongodb').ObjectID;
// used for testing
var assert = require('assert');

// parse response body
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

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

var didPushProblems = false;
var didPushQuestions = false;
var didPushSuggestions = false;

// upon runinng server
console.log("server started");

var usersURL = 'mongodb://localhost:27017/users';
var theoURL = 'mongodb://localhost:27017/Theo';

// open static files in folder
router.use(express.static('views'));

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
  var id = dictionaryData[dictionaryKeys[0]];

  for (var i = 1; i < dictionarySize; i+=4) {
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
      user: id,
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

  // redirect to home page
  response.redirect('/');
  console.log("preparing to insert");

  // connect to mongo db db
  mongo.connect(usersURL, function(error, db) {
    //assert.equal(null, error);
    console.log("connected to database");
    // insert in db
    console.log(db);

    // insert under name under users
    db.collection(id).insert(items, function() {
      assert.equal(null, error);
      console.log("successfully inserted in " + id);
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
router.post('/deleteData', function(request, response) {

  // get collection name to delete from
  var name = request.body.collectionName;

  // get id to be deleted
  var id = request.body.id;
  response.redirect('/');

  mongo.connect(usersURL, function(error, db) {
    assert.equal(null, error);
    db.collection(name).deleteOne({"_id": objectID(id)}, function (error, result) {
      assert.equal(null, error);
      console.log("Item: " + id + " has been deleted");
      db.close();
    })
  });

});



/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

module.exports = router;
