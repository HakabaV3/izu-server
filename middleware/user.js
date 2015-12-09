var User = {
    model: require('../model/user.js'),
  },
  ObjectId = require('mongoose').Types.ObjectId,
  middleware = {};

middleware.findOneByAuth = function(req, res, next) {
  User.model.findOne({
    uuid: req.session.auth.userId,
    deleted: false
  }, {}, function(err, user) {
    if (err) {
      return res.ng({error: err});
    }
    if (!user) {
      return res.ng({error: 'NOT_FOUND'});
    }
    req.session.user = user;
    next();
  });
};

middleware.findOneByName = function(req, res, next) {
  var name = req.params.name || req.session.name;
  User.model.findOne({
    name: req.params.name,
    deleted: false
  }, {}, function(err, user){
    if (err) {
      return res.ng({error: err});
    }
    if (!user) {
      return res.ng({error: 'NOT_FOUND'});
    }
    req.session.user = user;
    next();
  });
};

middleware.findOneByNameAndPassword = function(req, res, next) {
  var name = req.body.name,
    password = User.model.toHashedPassword(req.body.password);
  User.model.findOne({
    name: name,
    password: password,
    deleted: false
  }, {}, function(err, user) {
    if (err) {
      return res.ng({error: err});
    }
    if (!user) {
      return res.ng({error: 'NOT_FOUND'});
    }
    req.session.user = user;
    next();
  });
};

middleware.render = function(req, res, next) {
  User.model.toObject(req.session.user, function(err, user) {
    if (err) {
      return res.ng({error: err});
    }
    return res.ok({user: user});
  });
};

middleware.renderAll = function(req, res, next) {
  User.model.toObjectAll(req.session.users, function(err, users) {
    if (err) {
      return res.ng({error: err});
    }
    return res.ok({users: users});
  });
};

middleware.renderAuth = function(req, res, next) {
  User.model.toObjectAuth(req.session.auth, req.session.user, function(err, user) {
    if (err) {
      return res.ng({error: err});
    }
    return res.ok({user: user});
  });
};

module.exports = middleware;
