var express = require('express'),
	Auth = require('../../model/auth.js'),
	User = require('../../model/user.js'),
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
		.catch(function(err) {
			return res.ng(err.code, {
				error: err.error
			});
		});
});

/*
 * @body
 * userName String
 * password String
 */
router.post('/', function(req, res) {
	console.log(`[${req.method}] ${req.baseUrl}`);
	User.pSignIn(req.body.name, User.toHashedPassword(req.body.password))
		.then(Auth.pUpdate.bind(this, null, true))
		.then(User.pipeSuccessRender.bind(this, req, res))
		.catch(function(err) {
			return res.ng(err.code, {
				error: err.error
			});
		});
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
		.then(function() {
			return res.ok(201, {});
		})
		.catch(function(err) {
			return res.ng(err.code, {
				error: err.error
			});
		});
});

module.exports = router;