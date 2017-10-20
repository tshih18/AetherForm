var mongoose = require('mongoose');

var keySchema = new mongoose.Schema({
  key: String
});


var Key = mongoose.model('keys', keySchema);

// use model in our project
module.exports = Key;
