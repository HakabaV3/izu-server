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
  deleted: {
    type: Boolean,
    default: false
  },
  uuid: {
    type: String,
    default: uuid.v4()
  },
  name: {
    type: String,
    required: true,
    index: {
      unique:true
    }
  },
  password: {
    type: String,
    required: true
  }
});
