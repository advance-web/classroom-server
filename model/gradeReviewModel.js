const mongoose = require('mongoose');

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

// Virtual populate
gradeReviewSchema.virtual('comments', {
  ref: 'GradeReviewComment',
  foreignField: 'gradeReview',
  localField: '_id',
});

module.exports = mongoose.model('GradeReview', gradeReviewSchema);
