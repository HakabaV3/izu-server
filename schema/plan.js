var mongoose = require('../model/db.js'),
  uuid = require('node-uuid');

module.exports = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  title:  {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    default: uuid.v1()
  }
});
