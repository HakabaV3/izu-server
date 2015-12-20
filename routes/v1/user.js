var express = require('express'),
	User = require('../../model/user.js'),
	Auth = require('../../model/auth.js'),
	Plan = require('../../model/plan.js'),
	Photo = require('../../model/photo.js'),
	Error = require('./error.js'),
	uuid = require('node-uuid'),
	router = express.Router();

/*
 * GET /api/v1/user
 */
router.get('/', function(req, res) {
	User.pGetAll()
		.then(user => User.pipeSuccessRenderAll(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * GET /api/v1/user/:name
 */
router.get('/:name', function(req, res) {
	var query = {
		name: req.params.name,
		deleted: false
	};
	User.pGetOne(query)
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * POST /api/v1/user
 * name     String
 * password String
 */
router.post('/', function(req, res, next) {
	if (!req.body.password || !req.body.name) {
		return res.ng(400, {
			error: "INVALID_PARAMETER"
		});
	}
	var query = {
		uuid: uuid.v4(),
		name: req.body.name,
		password: User.toHashedPassword(req.body.password)
	};
	User.pCreate(query)
		.then(user => Auth.pUpdate(null, true, user))
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * PATCH /api/v1/user/:name (private)
 * name String
 * password String
 */
router.patch('/:name', function(req, res) {
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			name: req.params.name,
			deleted: false
		},
		updateValue = {
			updated: parseInt(Date.now() / 1000)
		};

	if (req.body.name) updateValue.name = req.body.name;
	if (req.body.password) updateValue.password = req.body.password;

	Auth.pGetOne(authQuery)
		.then(auth => User.pUpdate(userQuery, updateValue, auth))
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * DELETE /api/v1/user/:name (private)
 */
router.delete('/:name', function(req, res) {
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			name: req.params.name
		};
	Auth.pGetOne(authQuery)
		.then(auth => User.pSoftRemove(userQuery, auth))
		.then(userId => Auth.pRemove(userId))
		.then(userId => Plan.pSoftRemove(userId))
		.then(userId => Photo.pSoftRemove(userId))
		.then(function() {
			return res.ok(201, {});
		})
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;