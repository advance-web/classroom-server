const adminModel = require('../model/adminModel');
const factory = require('./factoryHandler');

exports.createAdminAccount = factory.createOne(adminModel);
exports.getAdmin = factory.getOne(adminModel);

exports.getMe = (req, res, next) => {
  req.params.id = req.admin.id;
  next();
};
