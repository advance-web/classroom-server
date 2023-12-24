exports.studentDoingAction = (req, res, next) => {
  req.body.student = req.user.id;
  next();
};
