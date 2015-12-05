var express = require('express'),
  router = express.Router(),
  userRouter = require('./user'),
  scoreRouter = require('./score');

express.response.ok = function(result) {
  return this.json({
    status: 'OK',
    result: result || {}
  });
};

express.response.ng = function(result) {
  return this.json({
    status: 'NG',
    result: result || {}
  });
};

router.use(function(req, res, next) {
  req.session = {};
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE'
  });
  next();
});

router.use('/user', userRouter);

module.exports = router;
