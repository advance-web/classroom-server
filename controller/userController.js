const factory = require('./factoryHandler');
const userModel = require('../model/userModel');

exports.getUser = factory.getOne(userModel);
exports.updateUser = factory.updateOne(userModel);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
