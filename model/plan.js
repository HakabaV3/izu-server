var mongoose = require('./db.js'),
	schema = require('../schema/plan.js');

var _ = {},
	model = mongoose.model('Plan', schema);

_.pGet = function(query, option) {
	query = query || {
		deleted: false
	};
	option = option || {
		sort: {
			created: 'desc'
		}
	};
	if (!query.deleted) query.deleted = false;

	return new Promise(function(resolve, reject) {
		model.find(query, {}, option, function(err, plans) {
			if (err) return reject({
				code: 400,
				error: err
			});
			resolve(plans);
		});
	});
};

_.pCreate = function(query, user) {
	query = query || {
		deleted: false
	};
	if (user) {
		query.userId = user.uuid;
		query.owner = user.name;
	}

	console.log('Plan.pCreate');
	console.log(`query = ${query}\n`);

	return new Promise(function(resolve, reject) {
		new model(query)
			.save(function(err, createdPlan) {
				if (err) return reject({
					code: 400,
					error: err
				});
				resolve(createdPlan);
			});
	});
};

_.pUpdate = function(query, updateValue) {
	query = query || {
		deleted: false
	};

	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(query, {
			$set: updateValue
		}, {
			new: true
		}, function(err, updatedPlan) {
			if (err) return reject({
				code: 400,
				error: err
			});
			if (!updatedPlan) return reject({
				code: 404,
				error: 'NOT_FOUND'
			});
			resolve(updatedPlan);
		});
	});
};

_.pRemove = function(query, user) {
	console.log('Plan.pRemove');

	query = query || {};
	if (user.userId) query.userId = user.userId;

	return new Promise(function(resolve, reject) {
		model.remove(query, function(err) {
			if (err) return reject({
				code: 400,
				error: err
			});
			resolve();
		});
	});
};

_.pSoftRemove = function(userId) {
	return new Promise(function(resolve, reject) {
		model.update({
			userId: userId
		}, {
			$set: {
				deleted: true
			}
		}, {
			multi: true
		}, function(err) {
			if (err) return reject({
				code: 400,
				error: err
			});
			resolve(userId);
		});
	});
};

_.pipeSuccessRender = function(req, res, plan) {
	console.log(plan);
	return res.ok(200, {
		plan: {
			id: plan.uuid,
			title: plan.title,
			owner: plan.owner,
			userId: plan.userId,
			created: plan.created,
			updated: plan.updated
		}
	});
};

_.pipeSuccessRenderAll = function(req, res, plans) {
	return res.ok(200, {
		plans: plans.map(plan => {
			return {
				id: plan.uuid,
				title: plan.title,
				owner: plan.owner,
				userId: plan.userId,
				created: plan.created,
				updated: plan.updated
			};
		})
	});
};

module.exports = _;