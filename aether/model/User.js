var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
})

var User = mongoose.model('AuthUsers', userSchema);

// use model in our project
module.exports = User;
