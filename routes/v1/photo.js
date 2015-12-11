var express = require('express'),
  Auth = {
    model: require('../../model/auth.js'),
    middleware: require('../../middleware/auth.js')
  },
  User = {
    model: require('../../model/user.js'),
    middleware: require('../../middleware/user.js')
  },
  Photo = {
    model: require('../../model/photo.js'),
    middleware: require('../../middleware/photo.js')
  },
  multer = require('multer'),
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  uploader = multer({ storage: storage }),
  router = express.Router();

/*
 * GET /api/v1/plan/:userName/:planId/photo
 */
router.get('/',
  function(req, res, next) {
    req.session.query = {
      planId: req.session.planId,
      deleted: false
    };
    req.session.option = {
      sort: {
        created: 'desc'
      }
    };
    next();
  },
  Photo.middleware.find,
  Photo.middleware.renderAll
);

/*
 * POST /api/v1/plan/:userName/:planId/photo (private)
 */
router.post('/',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  uploader.fields([{
      name: 'photo', maxCount: 1
    }, {
      name: 'detail', maxCount: 4
    }
  ]),
  Photo.model.newObject,
  Photo.middleware.render
);

/*
 * PATCH /api/v1/plan/:userName/:planId/photo/:photoId (private)
 */
router.patch('/:photoId',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  function(req, res, next) {
    var latitude = req.body.latitude,
      longitude = req.body.longitude,
      description = req.body.description,
      updateValue = {
        updated: new Date()
      };

    if (latitude) { updateValue.latitude = latitude }
    if (longitude) { updateValue.longitude = longitude }
    if (description) { updateValue.description = description }

    Photo.model.findOneAndUpdate({uuid: req.params.photoId}, {$set: updateValue}, {new: true}, function(err, updatedPhoto) {
      if (err) {
        return res.ng(400, {error: err});
      }
      if (!updatedPhoto) {
        return res.ng(404, {error: 'NOT_FOUND'});
      }

      req.session.photo = updatedPhoto;
      next();
    });
  },
  Photo.middleware.render
);

/*
 * DELETE /api/v1/plan/:userName/:planId/photo/:photoId (private)
 */
router.delete('/:photoId',
  Auth.middleware.findOne,
  User.middleware.findOneByAuth,
  function(req, res, next) {
    Photo.model.remove({uuid: req.params.photoId}, function(err) {
      if (err) {
        return res.ng(400, {error: err});
      }
      return res.ok(201, {});
    });
  }
);

module.exports = router;
