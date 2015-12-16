var express = require('express'),
	router = express.Router(),
	authRouter = require('./v1/auth'),
	userRouter = require('./v1/user'),
	planRouter = require('./v1/plan'),
	photoRouter = require('./v1/photo');

express.response.ok = function(code, result) {
	return this.json({
		status: code,
		result: result || {}
	});
};

express.response.ng = function(code, result) {
	return this.json({
		status: code,
		result: result || {}
	});
};

router.use(function(req, res, next) {
	req.session = {};
	res.set({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'X-Session-Token,Content-Type',
		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE'
	});
	next();
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/plan', planRouter);
router.use('/plan/:userName/:planId/photo', [
	function(req, res, next) {
		req.session.planId = req.params.planId;
		next();
	},
	photoRouter
]);

module.exports = router;