var mongoose = require('../model/db.js');

module.exports = new mongoose.Schema({
	created: {
		type: Number,
		default: parseInt(Date.now() / 1000)
	},
	updated: {
		type: Number,
		default: parseInt(Date.now() / 1000)
	},
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
	uuid: String
});