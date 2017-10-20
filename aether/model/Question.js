var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
  user: String,
  subtag: String,
  title: String,
  content: String,
  date: String,
  time: String,
  milliSeconds: Number
});


var Question = mongoose.model('questions', questionSchema);

// use model in our project
module.exports = Question;
