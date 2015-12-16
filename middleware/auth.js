var Auth = {
		model: require('../model/auth.js'),
	},
	ObjectId = require('mongoose').Types.ObjectId,
	middleware = {};

middleware.findOne = function(req, res, next) {
	var token = req.headers['x-session-token'];
	if (!token) {
		return res.ng(400, {
			error: 'INVALID_PARAMETER'
		});
	}

	Auth.model.findOne({
		token: token
	}, {}, function(err, auth) {
		if (err) {
			return res.ng(400, {
				error: err
			});
		}
		if (!auth) {
			return res.ng(404, {
				error: 'NOT_FOUND'
			});
		}

		req.session.auth = auth;
		next();
	});
};

middleware.findOneAndUpdateToken = function(req, res, next) {
	var token = req.headers['x-session-token'],
		updateValue = {
			updated: parseInt(Date.now() / 1000)
		};
	if (!token) {
		return res.ng(400, {
			error: 'INVALID_PARAMETER'
		});
	}

	updateValue.token = Auth.model.createToken();

	Auth.model.findOneAndUpdate({
		token: token
	}, {
		$set: updateValue
	}, {
		new: true
	}, function(err, updatedAuth) {
		if (err) {
			return res.ng(400, {
				error: err
			});
		}

		if (!updatedAuth) {
			return res.ng(404, {
				error: 'NOT_FOUND'
			})
		}

		req.session.auth = updatedAuth;
		next();
	});
};

module.exports = middleware;