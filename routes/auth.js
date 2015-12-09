var express = require('express'),
  Auth = {
    model: require('../model/auth.js'),
    middleware: require('../middleware/auth.js')
  },
  User = {
    model: require('../model/user.js'),
    middleware: require('../middleware/user.js')
  },
  router = express.Router();

/*
 * token String
 */
router.get('/me',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  User.middleware.renderAuth
);

/*
 * userName String
 * password String
 */
router.post('/', User.middleware.findOneByNameAndPassword,
  function(req, res, next) {
  User.model.findOne({name: req.body.name, password: User.model.toHashedPassword(req.body.password)},{}, function(err, user) {
    if (err) {
      return res.ng(400, {error: err});
    }
    Auth.model.findOneAndUpdate({userId: req.session.user.uuid}, {$set: {token: Auth.model.createToken()}}, {new: true}, function(err, auth) {
      if (err) {
        return res.ng(400, {error: err});
      }
      if (auth) {
        req.session.auth = auth;
        return next();
      }
      new Auth.model({
        token: Auth.model.createToken(),
        userId: user.uuid
      })
      .save(function(err, createdAuth) {
        if (err) {
          return res.ng(400, {error: err});
        }
        req.session.auth = createdAuth;
        next();
      });
    });
  });
}, User.middleware.renderAuth);

/*
 * token String
 */
router.delete('', Auth.middleware.findOne,
  function(req, res, next) {
    Auth.model.remove({userId: req.session.auth.userId}, function(err, deletedAuth) {
      if (err) { return res.ng(400, {error: err}); }
      return res.ok(201, {});
    });
  });

module.exports = router;
