const mongoose = require('mongoose');

const studentGradeSchema = new mongoose.Schema(
  {
    structureGrade: {
      type: mongoose.Schema.ObjectId,
      ref: 'StructureGrade',
      required: [
        true,
        'Student grade must have reference to a structure grade',
      ],
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Grade must belong to a student'],
    },
    grade: {
      type: Number,
      require: [true, 'Grade must have a number value'],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Grade must be mark by a teacher'],
    },
    classroom: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classroom',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('StudentGrade', studentGradeSchema);
