const mongoose = require('mongoose');
const ClassroomParticipantModel = require('./classroomParticipantModel');
const uIdGenerator = require('../utils/UIDGenerator');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter name'],
    },
    subject: {
      type: String,
      required: [true, 'Please enter subject'],
    },
    description: {
      type: String,
    },
    maxStudent: {
      type: Number,
      required: [true, 'Please enter subject'],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Class must belong to a teacher'],
    },
    joinCode: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

classroomSchema.pre('save', async function (next) {
  if (this.isNew) {
    await ClassroomParticipantModel.create({
      classroom: this.id,
      user: this.teacher,
    });
  }
  next();
});

classroomSchema.pre('save', function (next) {
  this.joinCode = uIdGenerator();
  next();
});

module.exports = mongoose.model('Classroom', classroomSchema);
