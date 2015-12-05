var express = require('express'),
  User = {
    model: require('../model/user.js'),
    middleware: require('../middleware/user.js')
  },
  Score = {
    model: require('../model/score.js'),
    middleware: require('../middleware/score.js')
  },
  uuid = require('node-uuid'),
  router = express.Router();

router.post('/', function(req, res, next) {
  new User.model({
    uuid: uuid.v4()
  })
  .save(function(err, createdUser) {
    if (err) { return res.ng(err); }

    req.session.user = createdUser;
    next();
  });
}, User.middleware.render);

router.post('/:userId/score', function(req, res, next) {
  new Score.model({
    userId: req.params.userId,
    value: req.body.value
  })
  .save(function(err, createdScore) {
    if (err) {
      return res.ng(err);
    }

    req.session.score = createdScore;
    next();
  });
}, Score.middleware.render);

module.exports = router;
