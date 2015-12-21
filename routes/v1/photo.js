var express = require('express'),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Photo = require('../../model/photo.js'),
	Error = require('../../model/error.js'),
	fs = require('fs'),
	multer = require('multer'),
	storage = multer.diskStorage({
		destination: function(req, file, cb) {
			var path = `uploads/${req.session.name}`;
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
				path = path + `/${req.session.planId}`;
				if (!fs.existsSync(path)) fs.mkdirSync(path);
			}

			cb(null, path)
		},
		filename: function(req, file, cb) {
			cb(null, Date.now() + '-' + file.originalname);
		}
	}),
	uploader = multer({
		storage: storage
	}),
	uuid = require('node-uuid'),
	router = express.Router();

/*
 * GET /api/v1/plan/:userName/:planId/photo
 */
router.get('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var photoQuery = {
			planId: req.session.planId,
			deleted: false
		},
		option = {
			sort: {
				created: 'desc'
			}
		};
	Photo.pGet(photoQuery, option)
		.then(photos => Photo.pipeSuccessRenderAll(req, res, photos))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * GET /api/v1/plan/:userName/:planId/photo/:photoId
 */
router.get('/:photoId', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var photoQuery = {
			uuid: req.params.photoId,
			deleted: false
		},
		params = {
			width: parseInt(req.query.width) || null,
			height: parseInt(req.query.height) || 300,
			quality: req.query.quality || '',
			webp: req.query.webp ? !!parseInt(req.query.webp) : true
		};
	console.log(req.query);
	Photo.pGetOne(photoQuery)
		.then(photo => Photo.pGetConvertedImage(req, res, photo, params))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * POST /api/v1/plan/:userName/:planId/photo (private)
 */
router.post('/', uploader.fields([{
		name: 'photo',
		maxCount: 1
	}, {
		name: 'detail',
		maxCount: 4
	}]),
	function(req, res) {
		console.log(`[${req.method}] ${req.url}`);
		var authQuery = {
				token: req.headers['x-session-token']
			},
			userQuery = {
				name: req.session.name,
				deleted: false
			},
			photo = req.files.photo[0],
			json = JSON.parse(fs.readFileSync(req.files.detail[0].path, 'utf8')),
			photoQuery = {
				uuid: uuid.v4(),
				planId: req.session.planId,
				description: json.description,
				date: json.date,
				latitude: json.latitude,
				longitude: json.longitude,
				path: photo.path,
			};

		fs.unlink(req.files.detail[0].path, function(err) {
			if (err) console.error(err);
		});

		Auth.pGetOne(authQuery)
			.then(auth => User.pGetOne(userQuery, auth))
			.then(user => Photo.pCreate(photoQuery, user))
			.then(photo => Photo.pipeSuccessRender(req, res, photo))
			.catch(error => Error.pipeErrorRender(req, res, error));
	});

/*
 * PATCH /api/v1/plan/:userName/:planId/photo/:photoId (private)
 */
router.patch('/:photoId', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			name: req.session.name,
			deleted: false
		},
		photoQuery = {
			uuid: req.params.photoId,
			deleted: false
		},
		updateValue = {
			updated: parseInt(Date.now() / 1000)
		};

	if (req.body.latitude) updateValue.latitude = req.body.latitude;
	if (req.body.longitude) updateValue.longitude = req.body.longitude;
	if (req.body.description) updateValue.description = req.body.description;

	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne(userQuery, auth))
		.then(user => Photo.pUpdate(photoQuery, updateValue))
		.then(photo => Photo.pipeSuccessRender(req, res, photo))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * DELETE /api/v1/plan/:userName/:planId/photo/:photoId (private)
 */
router.delete('/:photoId', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			name: req.session.name,
			deleted: false,
		},
		photoQuery = {
			uuid: req.params.photoId,
			deleted: false
		};

	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne(userQuery, auth))
		.then(user => Photo.pRemove(photoQuery, user))
		.then(() => res.ok(201, {}))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;
