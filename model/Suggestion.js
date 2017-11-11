var mongoose = require('mongoose');

var suggestionSchema = new mongoose.Schema({
  user: String,
  subtag: String,
  title: String,
  content: String,
  date: String,
  time: String,
  milliSeconds: Number
});


var Suggestion = mongoose.model('suggestions', suggestionSchema);

// use model in our project
module.exports = Suggestion;
