var mongoose = require('./db.js'),
	crypto = require('crypto'),
	schema = require('../schema/auth.js');

var _ = {},
	model = mongoose.model('Auth', schema);

_.pGetOne = function(query, option) {
	return new Promise(function(resolve, reject) {
		model.findOne(query, option, function(err, auth) {
			if (err) return reject({
				code: 400,
				error: err
			});
			if (!auth) return reject({
				code: 404,
				error: 'NOT_FOUND'
			});
			return resolve(auth);
		})
	});
};

_.pUpdate = function(query, needNew, user) {
	console.log('Auth.pUpdate');
	query = query || {};
	if (user) query.userId = user.uuid;

	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(query, {
			$set: {
				token: _.createToken()
			}
		}, {
			new: true
		}, function(err, updatedAuth) {
			if (err) return reject({
				code: 400,
				error: err
			});

			if (updatedAuth) {
				if (!user) return resolve(updatedAuth);
				user.token = updatedAuth.token;
				return resolve(user);
			}
			if (!needNew) return reject({
				code: 404,
				error: 'NOT_FOUND'
			});

			new model({
					token: _.createToken(),
					userId: query.userId
				})
				.save(function(err, createdAuth) {
					if (err) return reject({
						code: 400,
						error: err
					});

					if (!user) return resolve(createdAuth);
					user.token = createdAuth.token;
					return resolve(user);
				});
		});
	})
};

_.pRemove = function(userId) {
	var query = {
		userId: userId
	};

	return new Promise(function(resolve, reject) {
		model.remove(query, function(err) {
			if (err) reject({
				code: 400,
				error: err
			});
			resolve();
		});
	});
};

_.createToken = function() {
	return crypto.createHash('sha512').update(crypto.randomBytes(256).toString()).digest('hex');
}

module.exports = _;