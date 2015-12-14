var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  created: {
    type: Number,
    default: parseInt(Date.now() / 1000)
  },
  updated: {
    type: Number,
    default: parseInt(Date.now() / 1000)
  },
  deleted: {
    type: Boolean,
    default: false
  },
  owner: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  description: String,
  date: Number,
  latitude: Number,
  longitude: Number,
  url: String,
  uuid: String
});
