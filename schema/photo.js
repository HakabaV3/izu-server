var mongoose = require('mongoose'),
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
  uuid: {
    type: String,
    default: uuid.v1()
  }
});
