var express = require('express'),
  Score = {
    model: require('../model/score.js'),
    middleware: require('../middleware/score.js')
  },
  router = express.Router();

router.get('/', function(req, res, next) {
  Score.model.find({}, {}, {sort: {value: 'desc'}, limit: 10}, function(err, scoreObjs) {
    if (err) {
      return res.ng({error: err});
    }
    res.ok(scoreObjs);
  });
});

module.exports = router;
