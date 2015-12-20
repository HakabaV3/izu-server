var express = require('express'),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Plan = require('../../model/plan.js'),
	Error = require('../../model/error.js'),
	uuid = require('node-uuid'),
	router = express.Router();

/*
 * GET /api/v1/plan
 */
router.get('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var query = {
			deleted: false
		},
		option = {
			sort: {
				created: 'desc'
			}
		};
	Plan.pGet(query, option)
		.then(plans => Plan.pipeSuccessRenderAll(req, res, plans))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * GET /api/v1/plan/:userName
 */
router.get('/:name', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var query = {
			owner: req.params.name,
			deleted: false
		},
		option = {
			sort: {
				created: 'desc'
			}
		};
	Plan.pGet(query, option)
		.then(plans => Plan.pipeSuccessRenderAll(req, res, plans))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * POST /api/v1/plan (private)
 * @body
 * title String
 */
router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			deleted: false
		},
		planQuery = {
			uuid: uuid.v4(),
			title: req.body.title,
			description: req.body.description,
			deleted: false
		};

	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne(userQuery, auth))
		.then(user => Plan.pCreate(planQuery, user))
		.then(plan => Plan.pipeSuccessRender(req, res, plan))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * PATCH /api/v1/plan/:userName/:planId (private)
 * title Sring
 */
router.patch('/:name/:planId', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			name: req.params.name,
			deleted: false
		},
		planQuery = {
			uuid: req.params.planId,
			deleted: false
		},
		updateValue = {
			updated: parseInt(Date.now() / 1000)
		};

	if (req.body.title) updateValue.title = req.body.title;
	if (req.body.description) updateValue.description = req.body.description;

	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne(userQuery, auth))
		.then(user => Plan.pUpdate(planQuery, updateValue))
		.then(plan => Plan.pipeSuccessRender(req, res, plan))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * DELETE /api/v1/plan/:userName/:planId (private)
 */
router.delete('/:name/:planId', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			name: req.params.name,
			deleted: false
		},
		planQuery = {
			uuid: req.params.planId
		};
	Auth.pGetOne(authQuery)
		.then(auth => User.pGetOne(userQuery, auth))
		.then(user => Plan.pRemove(planQuery, user))
		.then(() => res.ok(201, {}))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;