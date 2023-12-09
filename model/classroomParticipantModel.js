const mongoose = require('mongoose');

const classroomParticipantSchema = new mongoose.Schema(
  {
    classroom: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom not found'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Class must have user to join in'],
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

module.exports = mongoose.model(
  'ClassroomParticipant',
  classroomParticipantSchema
);
