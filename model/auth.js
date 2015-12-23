var mongoose = require('./db.js'),
	crypto = require('crypto'),
	schema = require('../schema/auth.js'),
	Error = require('./error.js');

var _ = {},
	model = mongoose.model('Auth', schema);

_.pGetOne = function(query, option) {
	return new Promise(function(resolve, reject) {
		model.findOne(query, option, function(err, auth) {
			if (err) return reject(Error.mongoose(500, err));
			if (!auth) return reject(Error.unauthorized);

			return resolve(auth);
		})
	});
};

_.pCreate = function(user) {
	console.log('Auth.pCreate');
	query = {
		token: _.createToken(),
		userId: user.uuid
	};

	return new Promise(function(resolve, reject) {
		new model(query)
			.save(function(err, createdAuth) {
				if (err) return reject(Error.mongoose(500, err));

				if (createdAuth) {
					if (!user) return resolve(createdAuth);
					console.log(`After created: ${createdAuth}`);
					user.token = createdAuth.token;
					return resolve(user);
				}
			});
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
			if (err) return reject(Error.mongoose(500, err));

			if (updatedAuth) {
				if (!user) return resolve(updatedAuth);
				user.token = updatedAuth.token;
				return resolve(user);
			}
			if (!needNew) return reject(Error.unauthorized);

			new model({
					token: _.createToken(),
					userId: query.userId
				})
				.save(function(err, createdAuth) {
					if (err) return reject(Error.mongoose(500, err));
					if (!createdAuth) return reject(Error.invalidParameter);

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
			if (err) reject(Error.mongoose(500, err));
			resolve();
		});
	});
};

_.removeExpiredObject = function(date) {
	var query = {
		expired: {
			$lte: date
		}
	};
	model.remove(query, function(err, res) {
		if (err) console.error(err);
		console.log(res.result.n);
		return true;
	});
};

_.createToken = function() {
	return crypto.createHash('sha512').update(crypto.randomBytes(256).toString()).digest('hex');
}

module.exports = _;