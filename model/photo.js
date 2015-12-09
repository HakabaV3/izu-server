var mongoose = require('./db.js'),
  schema = require('../schema/photo.js');

var model = mongoose.model('Photo', schema);

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
    updated: photo.updated
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
      updated: photo.updated
    };
  }));
};

module.exports = model;
