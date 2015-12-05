var express = require('express'),
  User = {
    model: require('../model/user.js'),
    middleware: require('../middleware/user.js')
  },
  router = express.Router();

/*
 * name     String
 * password String
 * email    String
 */
router.post('/', function(req, res, next) {
  if (!req.body.password) {
    return res.ng({error: "PARAMETER_IS_INVALID"});
  }
  new User.model({
    name: req.body.name,
    password: User.model.toHashedPassword(req.body.password)
  })
  .save(function(err, createdUser) {
    if (err) { return res.ng(err); }

    req.session.user = createdUser;
    next();
  });
}, User.middleware.render);

module.exports = router;
