var express = require('express'),
	Auth = {
		model: require('../../model/auth.js'),
		middleware: require('../../middleware/auth.js')
	},
	User = {
		model: require('../../model/user.js'),
		middleware: require('../../middleware/user.js')
	},
	Plan = {
		model: require('../../model/plan.js'),
		middleware: require('../../middleware/plan.js')
	},
	uuid = require('node-uuid'),
	router = express.Router();

/*
 * GET /api/v1/plan
 */
router.get('/',
	function(req, res, next) {
		req.session.query = {
			deleted: false
		};
		req.session.option = {
			sort: {
				created: 'desc'
			}
		};
		next();
	},
	Plan.middleware.find,
	Plan.middleware.renderAll
);

/*
 * GET /api/v1/plan/:userName
 */
router.get('/:name',
	User.middleware.findOneByName,
	function(req, res, next) {
		req.session.query = {
			deleted: false,
			owner: req.params.name
		};
		req.session.option = {
			sort: {
				created: 'desc'
			}
		};
		next();
	},
	Plan.middleware.find,
	Plan.middleware.renderAll
);

/*
 * POST /api/v1/plan (private)
 * title String
 */
router.post('/',
	Auth.middleware.findOne,
	User.middleware.findOneByAuth,
	function(req, res, next) {
		new Plan.model({
				uuid: uuid.v4(),
				title: req.body.title,
				owner: req.session.user.name,
				userId: req.session.user.uuid
			})
			.save(function(err, createdPlan) {
				if (err) {
					return res.ng(400, {
						error: err
					});
				}
				req.session.plan = createdPlan;
				next();
			});
	},
	Plan.middleware.render
);

/*
 * PATCH /api/v1/plan/:userName/:planId (private)
 * title Sring
 */
router.patch('/:name/:id',
	Auth.middleware.findOne,
	User.middleware.findOneByAuth,
	function(req, res, next) {
		var title = req.body.title,
			updateValue = {
				updated: parseInt(Date.now() / 1000)
			};

		if (title) {
			updateValue.title = title
		}

		Plan.model.findOneAndUpdate({
			uuid: req.params.id
		}, {
			$set: updateValue
		}, {
			new: true
		}, function(err, updatedPlan) {
			if (err) {
				return res.ng(400, {
					error: err
				});
			}
			if (!updatedPlan) {
				return res.ng(404, {
					error: 'NOT_FOUND'
				});
			}

			req.session.plan = updatedPlan;
			next();
		});
	},
	Plan.middleware.render
);

/*
 * DELETE /api/v1/plan/:userName/:planId (private)
 */
router.delete('/:name/:id',
	Auth.middleware.findOne,
	User.middleware.findOneByAuth,
	function(req, res, next) {
		Plan.model.remove({
			uuid: req.params.id
		}, function(err) {
			if (err) {
				return res.ng(400, {
					error: err
				});
			}
			return res.ok(201, {});
		});
	}
);

module.exports = router;