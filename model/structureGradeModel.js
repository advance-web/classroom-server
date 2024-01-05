const mongoose = require('mongoose');
const studentGradeModel = require('./studentGradeModel');

const structureGradeSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Structure grade must be created by a teacher'],
    },
    classroom: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classroom',
      required: [true, 'Structure grade must belong to a class'],
    },
    name: {
      type: String,
      require: [true, 'Structure grade must have a name'],
    },
    scale: {
      type: Number,
      require: [true, 'Structure grade must have scale'],
    },
    isFinalize: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

structureGradeSchema.pre('findOneAndDelete', async function (next) {
  const query = this.getQuery();
  const structureGradeId = query._id;
  console.log(structureGradeId);
  const doc = await studentGradeModel.deleteMany({
    structureGrade: mongoose.Types.ObjectId(structureGradeId),
  });
  console.log(doc);
  next();
});

module.exports = mongoose.model('StructureGrade', structureGradeSchema);
