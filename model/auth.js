var mongoose = require('./db.js'),
  crypto = require('crypto'),
  schema = require('../schema/auth.js');

var model = mongoose.model('Auth', schema);

model.toObject = function(auth, callback) {
  return callback(null, {
    id: auth._id.toString(),
    token: auth.token,
    created: auth.created,
    updated: auth.updated
  });
};

model.createToken = function() {
  return crypto.createHash('sha512').update(crypto.randomBytes(256).toString()).digest('hex');
}

module.exports = model;
