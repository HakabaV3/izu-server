var mongoose = require('./db.js'),
	schema = require('../schema/user.js'),
	crypto = require('crypto'),
	Auth = require('./auth.js'),
	Error = require('./error.js');

var _ = {},
	model = mongoose.model('User', schema);

_.pGetOne = function(query, object) {
	if (!query.deleted) query.deleted = false;
	if (object && object.userId) query.uuid = object.userId;

	return new Promise(function(resolve, reject) {
		model.findOne(query, {}, function(err, user) {
			if (err) return reject(Error.mongoose(500, err));
			if (!user) return reject(Error.invalidParameter);

			if (object && object.token) {
				user.token = object.token;
			}
			return resolve(user);
		});
	});
};

_.pGetAll = function(query) {
	query = query || {
		deleted: false
	};
	if (!query.deleted) query.deleted = false;

	return new Promise(function(resolve, reject) {
		model.find(query, function(err, users) {
			if (err) return reject(Error.mongoose(500, err));

			resolve(users);
		});
	});
};

_.pCreate = function(query) {
	return new Promise(function(resolve, reject) {
		new model(query)
			.save(function(err, createdUser) {
				if (err) return reject(Error.mongoose(500, err));

				resolve(createdUser);
			});
	})

}

_.pUpdate = function(query, updateValue, object) {
	query = query || {};
	if (object.userId) query.uuid = object.userId;

	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(query, {
			$set: updateValue
		}, {
			new: true
		}, function(err, updatedUser) {
			if (err) return reject(Error.mongoose(500, err));
			if (!updatedUser) return reject(Error.invalidParameter);

			resolve(updatedUser);
		});
	});
};

_.pSoftRemove = function(query, auth) {
	query = query || {};
	if (auth.userId) query.uuid = auth.userId;

	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(query, {
			$set: {
				deleted: true
			}
		}, {
			new: true
		}, function(err) {
			if (err) return reject(Error.mongoose(500, err));

			resolve(auth.userId);
		});
	});
};

_.pSignIn = function(name, password) {
	console.log('User.pSignIn');
	var query = {
		name: name,
		password: password,
		deleted: false
	};
	return new Promise(function(resolve, reject) {
		model.findOne(query, {}, function(err, user) {
			if (err) return reject(Error.mongoose(500, err));
			if (!user) return reject(Error.unauthorized);

			return resolve(user);
		})
	})
}

_.toHashedPassword = function(password) {
	var salt = 'kahun shouga tsurai';
	return crypto.createHash('sha512').update(salt + password).digest('hex');
}

_.pipeSuccessRender = function(req, res, user) {
	console.log('User.pipeSuccessRender');
	var userObj = {
		id: user.uuid,
		name: user.name,
		created: user.created,
		updated: user.updated
	};
	if (user.token) {
		userObj.token = user.token;
	}
	return res.ok(200, {
		user: userObj
	});
};

_.pipeSuccessRenderAll = function(req, res, users) {
	return res.ok(200, {
		users: users.map(function(user) {
			return {
				id: user.uuid,
				name: user.name,
				created: user.created,
				updated: user.updated
			};
		})
	});
};

module.exports = _;