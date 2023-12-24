const factory = require('./factoryHandler');
const structureGradeModel = require('../model/structureGradeModel');

exports.createStructureGrade = factory.createOne(structureGradeModel);
exports.updateStructureGrade = factory.updateOne(structureGradeModel);
exports.deleteStructureGrade = factory.deleteOne(structureGradeModel);

// exports.participateInClassroom = catchAsync(async (req,res, next) => {
// const structureGradeId = req.params.id
// const teacher = req.user.id
// const doc = await classroomParticipantModel.findOne({  })
// })
