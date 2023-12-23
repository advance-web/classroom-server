const mongoose = require('mongoose');

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('StructureGrade', structureGradeSchema);
