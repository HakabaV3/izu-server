var Plan = {
    model: require('../model/plan.js')
  },
  ObjectId = require('mongoose').Types.ObjectId,
  middleware = {};

middleware.render = function(req, res, next) {
  Plan.model.toObject(req.session.plan, function(err, plan) {
    if (err) {
      return res.ng(400, {error: err});
    }
    return res.ok(200, plan);
  });
};

middleware.renderAll = function(req, res, next) {
  Plan.model.toObjectAll(req.session.plans, function(err, plans) {
    if (err) {
      return res.ng(400, {error: err});
    }
    return res.ok(200, plans);
  });
};

module.exports = middleware;
