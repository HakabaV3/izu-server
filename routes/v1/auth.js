var express = require('express'),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
	Error = require('./error.js'),
	router = express.Router();

/*
 * @header
 * token String
 */
router.get('/me', function(req, res) {
	console.log(`[${req.method}] ${req.url}`);
	var authQuery = {
			token: req.headers['x-session-token']
		},
		userQuery = {
			deleted: false
		};
	Auth.pUpdate(authQuery, false)
		.then(User.pGetOne.bind(this, userQuery))
		.then(User.pipeSuccessRender.bind(this, req, res))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * @body
 * userName String
 * password String
 */
router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.baseUrl}`);
	User.pSignIn(req.body.name, User.toHashedPassword(req.body.password))
		.then(user => Auth.pUpdate(null, true, user))
		.then(user => User.pipeSuccessRender(req, res, user))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

/*
 * @header
 * token String
 */
router.delete('/', function(req, res, next) {
	console.log(`[${req.method}] ${req.baseUrl}`);
	var query = {
		token: req.headers['x-session-token']
	};
	Auth.pGetOne(query)
		.then(auth => Auth.pRemove(auth.userId))
		.then(() => res.ok(201, {}))
		.catch(error => Error.pipeErrorRender(req, res, error));
});

module.exports = router;