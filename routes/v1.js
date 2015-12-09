var express = require('express'),
  router = express.Router(),
  authRouter = require('./auth'),
  userRouter = require('./user'),
  planRouter = require('./plan');

express.response.ok = function(code, result) {
  return this.json({
    status: code,
    result: result || {}
  });
};

express.response.ng = function(code, result) {
  return this.json({
    status: code,
    result: result || {}
  });
};

router.use(function(req, res, next) {
  req.session = {};
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Session-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE'
  });
  next();
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/plan', planRouter);

module.exports = router;
