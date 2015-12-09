var Auth = {
    model: require('../model/auth.js'),
  },
  ObjectId = require('mongoose').Types.ObjectId,
  middleware = {};

middleware.findOne = function(req, res, next) {
  var token = req.headers['x-session-token'];
  if (!token) {
    return res.ng(400, {error: 'INVALID_PARAMETER'});
  }

  Auth.model.findOne({
    token: token
  }, {}, function(err, auth) {
    if (err) {
      return res.ng(400, {error: err});
    }
    if (!auth) {
      return res.ng(404, {error: 'NOT_FOUND'});
    }

    req.session.auth = auth;
    next();
  });
};

module.exports = middleware;