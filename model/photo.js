var mongoose = require('./db.js'),
	config = require('../config/config.js'),
	schema = require('../schema/photo.js'),
	fs = require('fs'),
	exif = require('exif').ExifImage,
	sharp = require('sharp'),
	Error = require('./error.js');

var _ = {},
	model = mongoose.model('Photo', schema);

_.pGet = function(query, option) {
	return new Promise(function(resolve, reject) {
		model.find(query, {}, option, function(err, photos) {
			if (err) return reject(Error.mongoose(500, err));

			resolve(photos);
		});
	});
};

_.pGetOne = function(query) {
	return new Promise(function(resolve, reject) {
		model.findOne(query, function(err, photo) {
			if (err) return reject(Error.mongoose(500, err));
			if (!photo) return reject(Error.invalidParameter);

			resolve(photo);
		});
	});
};

_.pCreate = function(query, user) {
	Object.assign(query, {
		userId: user.uuid,
		owner: user.name,
		url: `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}/api/v1/plan/${user.name}/${query.planId}/photo/${query.uuid}`
	});
	return new Promise(function(resolve, reject) {
		new model(query)
			.save(function(err, createdPhoto) {
				if (err) return reject(Error.mongoose(500, err));
				if (!createdPhoto) return reject(Error.invalidParameter);

				resolve(createdPhoto);
			});
	});
};

_.pUpdate = function(query, updateValue) {
	return new Promise(function(resolve, reject) {
		model.findOneAndUpdate(query, {
			$set: updateValue
		}, {
			new: true
		}, function(err, updatedPhoto) {
			if (err) return reject(Error.mongoose(500, err));
			if (!updatedPhoto) return reject(Error.invalidParameter);

			resolve(updatedPhoto);
		});
	});
};

_.pRemove = function(query, user) {
	query = query || {};
	query.userId = user.uuid;
	return new Promise(function(resolve, reject) {
		model.findOneAndRemove(query, {}, function(err, removedPhoto) {
			if (err) return reject(Error.mongoose(500, err));
			if (!removedPhoto) return reject(Error.invalidParameter);

			fs.unlink(removedPhoto.path, function(err) {
				return resolve();
			});
		});
	});
};

_.pSoftRemove = function(userId) {
	return new Promise(function(resolve, reject) {
		model.update({
			userId: userId
		}, {
			$set: {
				deleted: true
			}
		}, {
			multi: true
		}, function(err) {
			if (err) return reject(Error.mongoose(500, err));

			resolve(userId);
		});
	});
};

_.pipeSuccessRender = function(req, res, photo) {
	return res.ok(200, {
		photo: {
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
		}
	});
};

_.pipeSuccessRenderAll = function(req, res, photos) {
	return res.ok(200, {
		photos: photos.map(function(photo) {
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
		})
	});
};

_.pGetConvertedImage = function(req, res, photo, params) {
	console.log('Photo.pGetConvertedImage');
	var image = sharp(photo.path),
		width, height, q, type;

	switch (params.quality) {
		case 'high':
			q = 80;
			break;
		case 'medium':
			q = 50;
			break;
		case 'low':
			q = 20;
			break;
		default:
			q = params.webp ? 20 : 40;
	}

	width = params.width || null;
	height = params.height || null;

	if (params.webp) {
		console.log(params);
		image
			.resize(width, height)
			.embed()
			.crop(sharp.gravity.center)
			.withoutEnlargement()
			.quality(q)
			.webp()
			.toBuffer()
			.then(function(data) {
				console.log('toBuffer');
				res.set({
					'Content-Type': 'image/webp'
				});
				res.write(data)
				res.end();
			});
	} else {
		console.log(params);
		image
			.resize(width, height)
			.embed()
			.crop(sharp.gravity.center)
			.withoutEnlargement()
			.quality(q)
			.toBuffer()
			.then(function(data) {
				console.log('toBuffer');
				res.set({
					'Content-Type': 'image/jpg'
				});
				res.write(data)
				res.end();
			});
	}
};

_.extractExif = function(imagePath) {
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

module.exports = _;