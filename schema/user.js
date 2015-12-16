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
	}
});