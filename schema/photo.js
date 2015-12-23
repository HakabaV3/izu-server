var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
	deleted: {
		type: Boolean,
		default: false
	},
	owner: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	planId: {
		type: String,
		required: true
	},
	description: String,
	date: Number,
	latitude: Number,
	longitude: Number,
	path: String,
	url: String,
	uuid: String,
	created: Number,
	updated: Number
});

photoSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;

	next();
});

module.exports = photoSchema;