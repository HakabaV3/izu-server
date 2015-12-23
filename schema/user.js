var mongoose = require('../model/db.js');

var userSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	uuid: String,
	name: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true
	},
	created: Number,
	updated: Number
});

userSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;

	next();
});

module.exports = userSchema;