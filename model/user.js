var mongoose = require('./db.js'),
	schema = require('../schema/user.js'),
	crypto = require('crypto');

var model = mongoose.model('User', schema);

model.toHashedPassword = function(password) {
	var salt = 'kahun shouga tsurai';
	return crypto.createHash('sha512').update(salt + password).digest('hex');
}

model.toObject = function(user, callback) {
	return callback(null, {
		id: user.uuid,
		name: user.name,
		created: user.created,
		updated: user.updated
	});
};

model.toObjectAll = function(users, callback) {
	return callback(null, users.map(function(user) {
		return {
			id: user.uuid,
			name: user.name,
			created: user.created,
			updated: user.updated
		};
	}));
};

model.toObjectAuth = function(auth, user, callback) {
	return callback(null, {
		id: user.uuid,
		name: user.name,
		created: user.created,
		updated: user.updated,
		token: auth.token
	});
};

module.exports = model;