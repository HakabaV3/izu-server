var mongoose = require('./db.js'),
  constant = require('../config/constant.js'),
  schema = require('../schema/photo.js'),
  fs = require('fs');

var model = mongoose.model('Photo', schema);

model.newObject = function(req, res, next) {
  var filePath = './' + req.files.detail[0].path,
    json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  new model({
    planId: req.session.planId,
    userId: req.session.user.uuid,
    owner: req.session.user.name,
    description: json.description,
    date: json.date,
    latitude: json.latitude,
    longitude: json.longitude,
    url: constant.serverUrlWithPath(req.files.photo[0].filename)
  })
  .save(function(err, createdPhoto) {
    if (err) {
      return res.ng(400, {error: err});
    }
    req.session.photo = createdPhoto;
    next();
  });
};

model.toObject = function(photo, callback) {
  return callback(null, {
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
  });
};

model.toObjectAll = function(photos, callback) {
  return callback(null, photos.map(function(photo) {
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
  }));
};

module.exports = model;
