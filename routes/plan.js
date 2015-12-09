var express = require('express'),
  Auth = {
    model: require('../model/auth.js'),
    middleware: require('../middleware/auth.js')
  },
  User = {
    model: require('../model/user.js'),
    middleware: require('../middleware/user.js')
  },
  Plan = {
    model: require('../model/plan.js'),
    middleware: require('../middleware/plan.js')
  },
  router = express.Router();

/*
 * GET /api/v1/plan/:userName
 */
router.get('/:name',
  User.middleware.findOneByName,
  function(req, res, next) {
    Plan.model.find({owner: req.params.name}, {}, {sort: {created: 'desc'}}, function(err, plans) {
      if (err) {
        return res.ng(400, {error: err});
      }
      req.session.plans = plans;
      next();
    });
  }, Plan.middleware.renderAll);

/*
 * POST /api/v1/plan (private)
 * title String
 * token String
 */
router.post('/',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  function(req, res, next) {
    new Plan.model({
      title: req.body.title,
      owner: req.session.user.name,
      userId: req.session.user.uuid
    })
    .save(function(err, createdPlan) {
      if (err) {
        return res.ng(400, {error: err});
      }
      req.session.plan = createdPlan;
      next();
    });
  }, Plan.middleware.render);

module.exports = router;
