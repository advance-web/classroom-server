const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeature = require('../utils/APIFeature');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError(404, 'No document found (ID not found) '));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError(404, 'No document found (invalid ID)'));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    console.log(req.body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, popOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOpt) query = query.populate(popOpt);
    const doc = await query;
    if (!doc) return next(new AppError(404, 'No doc found (invalid ID)'));
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //This is for allow review nested route
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //Executive query
    const features = new APIFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      requestedAt: req.requestTime,
      data: docs,
    });
  });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if (!tour) return next(new AppError(404, 'No tour found (ID not found) '));

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   });
