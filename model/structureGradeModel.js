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
    position: {
      type: Number,
      default: 1024,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

structureGradeSchema.pre('save', function (next) {
  const self = this;
  this.constructor
    .find({})
    .sort({ position: -1 })
    .limit(1)
    .exec((err, docs) => {
      if (docs.length > 0) {
        self.position = docs[0].position + 1024;
      } else {
        self.position = 1024;
      }
      next();
    });
});

structureGradeSchema.pre('findOneAndDelete', async function (next) {
  const query = this.getQuery();
  const structureGradeId = query._id;
  await studentGradeModel.deleteMany({
    structureGrade: mongoose.Types.ObjectId(structureGradeId),
  });
  next();
});

module.exports = mongoose.model('StructureGrade', structureGradeSchema);
