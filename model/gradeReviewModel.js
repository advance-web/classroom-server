const mongoose = require('mongoose');
const studentGradeModel = require('./studentGradeModel');

const gradeReviewSchema = new mongoose.Schema(
  {
    studentGrade: {
      type: mongoose.Schema.ObjectId,
      ref: 'StudentGrade',
      required: [true, 'Grade review must have a student grade'],
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Grade review must belong to a student'],
    },
    expectationGrade: {
      type: Number,
      require: [true, 'Grade review must have expectation grade'],
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ['ACCEPTED', 'DENIED', 'INREVIEW'],
      default: 'INREVIEW',
    },
    finalGrade: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gradeReviewSchema.post('findOneAndUpdate', async (doc, next) => {
  if (doc.status === 'ACCEPTED') {
    //Update student grade to expectation grade
    const data = await studentGradeModel.findByIdAndUpdate(
      doc.studentGrade,
      { grade: doc.finalGrade ? doc.finalGrade : doc.expectationGrade },
      { new: true }
    );
    console.log(data);
    return next();
  }

  return next();
});

// Virtual populate
gradeReviewSchema.virtual('comments', {
  ref: 'GradeReviewComment',
  foreignField: 'gradeReview',
  localField: '_id',
});

module.exports = mongoose.model('GradeReview', gradeReviewSchema);
