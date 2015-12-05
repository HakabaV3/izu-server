var express = require('express'),
  User = {
    model: require('../model/user.js'),
    middleware: require('../middleware/user.js')
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

module.exports = router;
