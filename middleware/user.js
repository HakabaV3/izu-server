var User = {
    model: require('../model/user.js'),
  },
  ObjectId = require('mongoose').Types.ObjectId,
  middleware = {};

middleware.render = function(req, res, next) {
  User.model.toObject(req.session.user, function(err, user) {
    if (err) {
      return res.ng({error: err});
    }
    return res.ok(user);
  });
};

module.exports = middleware;
