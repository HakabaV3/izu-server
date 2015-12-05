var mongoose = require('./db.js'),
  schema = require('../schema/score.js');

var model = mongoose.model('Score', schema);

model.toObject = function(score, callback) {
  return callback(null, {
    id: score._id.toString(),
    userId: score.userId,
    value: score.value,
    created: score.created,
    updated: score.updated
  });
};

module.exports = model;
