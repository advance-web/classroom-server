const factory = require('./factoryHandler');
const userModel = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUser = factory.getOne(userModel);
exports.updateUser = factory.updateOne(userModel);
exports.getAllUser = factory.getAll(userModel);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.mappingId = catchAsync(async (req, res, next) => {
  req.body.idMapping = req.body.id;
  const doc = await userModel.find({ idMapping: req.body.idMapping });
  if (doc.length) return next(new AppError(400, 'Id has taken'));
  next();
});
