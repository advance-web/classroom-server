const factory = require('./factoryHandler');
const structureGradeModel = require('../model/structureGradeModel');
const catchAsync = require('../utils/catchAsync');

exports.createStructureGrade = factory.createOne(structureGradeModel);
exports.updateStructureGrade = factory.updateOne(structureGradeModel);
exports.deleteStructureGrade = factory.deleteOne(structureGradeModel);

exports.sortStructureGrade = catchAsync(async (req, res) => {
  // Body: Prev: id, Next: id
  const { prev, next } = req.body;
  const { id: current } = req.params;

  const prevDoc = prev && (await structureGradeModel.findById(prev));
  const nextDoc = next && (await structureGradeModel.findById(next));

  let currentPosition = 0;
  if (!prev) {
    currentPosition = nextDoc.position / 2;
  } else if (!next) {
    currentPosition = prevDoc.position + 1024;
  } else {
    currentPosition = (nextDoc.position + prevDoc.position) / 2;
  }

  console.log(prevDoc, nextDoc, currentPosition);

  const currentDoc = await structureGradeModel.findByIdAndUpdate(
    current,
    {
      position: currentPosition,
    },
    { new: true }
  );

  return res.status(200).json(currentDoc);
});
// exports.participateInClassroom = catchAsync(async (req,res, next) => {
// const structureGradeId = req.params.id
// const teacher = req.user.id
// const doc = await classroomParticipantModel.findOne({  })
// })
