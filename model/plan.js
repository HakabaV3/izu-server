var mongoose = require('./db.js'),
  schema = require('../schema/plan.js');

var model = mongoose.model('Plan', schema);

model.toObject = function(plan, callback) {
  return callback(null, {
    id: plan.uuid,
    title: plan.title,
    owner: plan.owner,
    userId: plan.userId,
    created: plan.created,
    updated: plan.updated
  });
};

model.toObjectAll = function(plans, callback) {
  return callback(null, plans.map(function(plan) {
    return {
      id: plan.uuid,
      title: plan.title,
      owner: plan.owner,
      userId: plan.userId,
      created: plan.created,
      updated: plan.updated
    };
  }));
};

module.exports = model;
