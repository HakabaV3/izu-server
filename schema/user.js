var mongoose = require('../model/db.js');

module.exports = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
  uuid: String,
  name: String,
  email: String,
  password: String
});
