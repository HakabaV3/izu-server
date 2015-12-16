var mongoose = require('./db.js'),
	config = require('../config/config.js'),
	schema = require('../schema/photo.js'),
	uuid = require('node-uuid'),
	exif = require('exif').ExifImage,
	fs = require('fs');

var model = mongoose.model('Photo', schema);

model.newObject = function(req, res, next) {
	var photo = req.files.photo[0],
		photoId = uuid.v4(),
		json = JSON.parse(fs.readFileSync('./' + req.files.detail[0].path, 'utf8'));

	model.extractExif('./' + photo.path);

	new model({
			uuid: photoId,
			planId: req.session.planId,
			userId: req.session.user.uuid,
			owner: req.session.user.name,
			description: json.description,
			date: json.date,
			latitude: json.latitude,
			longitude: json.longitude,
			path: './' + photo.path,
			url: `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}/${photo.filename}`
		})
		.save(function(err, createdPhoto) {
			if (err) {
				return res.ng(400, {
					error: err
				});
			}
			req.session.photo = createdPhoto;
			next();
		});
};

model.extractExif = function(imagePath) {
	try {
		new exif({
			image: imagePath
		}, function(error, exifData) {
			if (error) {
				console.log('Error: ' + error.message);
				return;
			}
			// TODO: Add GPS data to photo model
			console.log(exifData);
		});
	} catch (error) {
		console.log('Error: ' + error.message);
	}
};

model.toObject = function(photo, callback) {
	return callback(null, {
		id: photo.uuid,
		planId: photo.planId,
		userId: photo.userId,
		owner: photo.owner,
		latitude: photo.latitude,
		longitude: photo.longitude,
		date: photo.date,
		description: photo.description,
		created: photo.created,
		updated: photo.updated,
		url: photo.url
	});
};

model.toObjectAll = function(photos, callback) {
	return callback(null, photos.map(function(photo) {
		return {
			id: photo.uuid,
			planId: photo.planId,
			userId: photo.userId,
			owner: photo.owner,
			latitude: photo.latitude,
			longitude: photo.longitude,
			date: photo.date,
			description: photo.description,
			created: photo.created,
			updated: photo.updated,
			url: photo.url
		};
	}));
};

module.exports = model;