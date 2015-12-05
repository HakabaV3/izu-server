var mongoose = require('./db.js'),
  schema = require('../schema/user.js');

var model = mongoose.model('User', schema);

model.toObject = function(user, callback) {
  return callback(null, {
    id: user._id.toString(),
    uuid: user.uuid,
    created: user.created,
    updated: user.updated
  });
};

module.exports = model;
