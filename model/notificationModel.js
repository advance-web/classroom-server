const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must sent by a user'],
    },
    to: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Notification must receive by a user'],
      },
    ],
    classroom: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classroom',
      required: [true, 'Notification must belong to a classroom'],
    },
    type: {
      type: String,
      enum: [
        'REPLY_GRADE_REVIEW',
        'NEW_GRADE_REVIEW',
        'DECIDED_GRADE_REVIEW',
        'FINALIZE_GRADE',
      ],
      require: [true, 'Notification must have a type'],
    },
    redirect: {
      type: String,
    },
    content: {
      type: String,
    },
    new: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('Notification', NotificationSchema);
