var Photo = {
    model: require('../model/photo.js')
  },
  middleware = {};

middleware.find = function(req, res, next) {
  Photo.model.find(req.session.query, {}, req.session.option, function(err, photos) {
    if (err) {
      return res.ng(400, {error: err});
    }
    if (!photos || photos.length == 0) {
      return res.ng(404, {error: 'NOT_FOUND'});
    }
    req.session.photos = photos;
    next();
  });
};

middleware.render = function(req, res, next) {
  Photo.model.toObject(req.session.photo, function(err, photo) {
    if (err) {
      return res.ng(400, {error: err});
    }
    return res.ok(200, {photo: photo});
  });
};

middleware.renderAll = function(req, res, next) {
  Photo.model.toObjectAll(req.session.photos, function(err, photos) {
    if (err) {
      return res.ng(400, {error: err});
    }
    return res.ok(200, {photos: photos});
  });
};

module.exports = middleware;
