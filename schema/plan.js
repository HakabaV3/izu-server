var mongoose = require('../model/db.js');

var planSchema = new mongoose.Schema({
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
	title: {
		type: String,
		required: true
	},
	description: String,
	uuid: String,
	created: Number,
	updated: Number
});

planSchema.pre('save', function(next) {
	now = parseInt(Date.now() / 1000);
	this.updated = now;
	if (!this.created) this.created = now;

	next();
});

module.exports = planSchema;