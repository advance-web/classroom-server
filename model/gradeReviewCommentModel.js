const mongoose = require('mongoose');

const gradeReviewCommentSchema = new mongoose.Schema(
  {
    gradeReview: {
      type: mongoose.Schema.ObjectId,
      ref: 'GradeReview',
      required: [true, 'Comment must in a grade review'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Grade review comment must belong to a user'],
    },
    comment: {
      type: String,
      require: [true, 'Grade review command must have content'],
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

gradeReviewCommentSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name email role',
  });
  next();
});

module.exports = mongoose.model('GradeReviewComment', gradeReviewCommentSchema);
