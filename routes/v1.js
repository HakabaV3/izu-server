var express = require('express'),
  router = express.Router(),
  authRouter = require('./auth'),
  userRouter = require('./user');

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
    'Access-Control-Allow-Headers': 'X-Session-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE'
  });
  next();
});

router.use('/auth', authRouter);
router.use('/user', userRouter);

module.exports = router;
