var express = require('express'),
  User = {
    model: require('../model/user.js'),
    middleware: require('../middleware/user.js')
  },
  Auth = {
    model: require('../model/auth.js'),
    middleware: require('../middleware/auth.js')
  },
  router = express.Router();

/*
 * GET /api/v1/user
 */
router.get('/', function(req, res, next) {
  User.model.find({deleted: false}, function(err, users) {
    if (err) {
      return res.ng(400, {error: err});
    }
    if (!users || users.length == 0) {
      return res.ng(404, {error: 'NOT_FOUND'});
    }
    req.session.users = users;
    next();
  })
}, User.middleware.renderAll);

/*
 * GET /api/v1/user/:name
 */
router.get('/:name',
  User.middleware.findOneByName,
  User.middleware.render
);

/*
 * POST /api/v1/user
 * name     String
 * password String
 */
router.post('/', function(req, res, next) {
  if (!req.body.password || !req.body.name) {
    return res.ng(400, {error: "INVALID_PARAMETER"});
  }
  new User.model({
    name: req.body.name,
    password: User.model.toHashedPassword(req.body.password)
  })
  .save(function(err, createdUser) {
    if (err) { return res.ng(400, {error: err}); }

    req.session.user = createdUser;
    next();
  });
}, User.middleware.render);

/*
 * PATCH /api/v1/user/:name (private)
 * name String
 * password String
 */
router.patch('/:name',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  function(req, res, next) {
    var name = req.body.name,
      password = req.body.password,
      updateValue = {
        updated: new Date()
      };

      if (name) { updateValue.name = name }
      if (password) { updateValue.password = User.model.toHashedPassword(password) }

      User.model.findOneAndUpdate({name: req.params.name}, {$set: updateValue}, function(err, updatedUser) {
        if (err) {
          return res.ng(400, {error: err});
        }
        if (!updatedUser) {
          return res.ng(404, {error: 'NOT_FOUND'});
        }

        req.session.user = updatedUser;
        next();
      })
  },
  User.middleware.render
);

/*
 * DELETE /api/v1/user/:name (private)
 */
router.delete('/:name',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  function(req, res, next) {
    User.model.findOneAndUpdate({
      name: req.params.name
    }, {
      $set: {
        updated: new Date(),
        deleted: true
      }
    }, function(err) {
      if (err) {
        return res.ng(400, {error: err});
      }
      Auth.model.findOneAndRemove({uuid: req.session.auth.uuid}, function(err) {
        if (err) {
          return res.ng(400, {error: err});
        }
        return res.ok(201, {});
      });
    });
  }
);

module.exports = router;
