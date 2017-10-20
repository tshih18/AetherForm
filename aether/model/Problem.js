var mongoose = require('mongoose');

var problemSchema = new mongoose.Schema({
  user: String,
  subtag: String,
  title: String,
  content: String,
  date: String,
  time: String,
  milliSeconds: Number
});


var Problem = mongoose.model('problems', problemSchema);

// use model in our project
module.exports = Problem;
