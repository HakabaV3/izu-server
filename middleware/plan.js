var Plan = {
    model: require('../model/plan.js')
  },
  ObjectId = require('mongoose').Types.ObjectId,
  middleware = {};

middleware.find = function(req, res, next) {
  if (!req.session.query.deleted) {
    req.session.query.deleted = false;
  }
  Plan.model.find(req.session.query, {}, req.session.option, function(err, plans) {
    if (err) {
      return res.ng(400, {error: err});
    }
    if (!plans || plans.length == 0) {
      return res.ng(404, {error: 'NOT_FOUND'});
    }
    req.session.plans = plans;
    next();
  });
};

middleware.render = function(req, res, next) {
  Plan.model.toObject(req.session.plan, function(err, plan) {
    if (err) {
      return res.ng(400, {error: err});
    }
    return res.ok(200, {plan: plan});
  });
};

middleware.renderAll = function(req, res, next) {
  Plan.model.toObjectAll(req.session.plans, function(err, plans) {
    if (err) {
      return res.ng(400, {error: err});
    }
    return res.ok(200, {plans: plans});
  });
};

module.exports = middleware;
