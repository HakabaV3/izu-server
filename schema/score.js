var mongoose = require('../model/db.js');
  Shema = mongoose.Schema;

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
  value: {
    type: Number,
    default: 0
  },
  userId: Shema.ObjectId
});
