var Score = {
    model: require('../model/score.js')
  },
  ObjectId = require('mongoose').Types.ObjectId,
  middleware = {};

middleware.render = function(req, res, next) {
  Score.model.toObject(req.session.score, function(err, score) {
    if (err) {
      return res.ng({error: err});
    }
    return res.ok(score);
  });
};

module.exports = middleware;
