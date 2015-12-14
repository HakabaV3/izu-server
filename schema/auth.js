var mongoose = require('../model/db.js');

module.exports = new mongoose.Schema({
  created: {
    type: Number,
    default: parseInt(Date.now() / 1000)
  },
  updated: {
    type: Number,
    default: parseInt(Date.now() / 1000)
  },
  token: String,
  userId: String
});
