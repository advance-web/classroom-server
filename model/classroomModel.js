const mongoose = require('mongoose');
const ClassroomParticipantModel = require('./classroomParticipantModel');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter name'],
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    maxStudent: {
      type: Number,
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Class must belong to a teacher'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

classroomSchema.pre('save', async function () {
  if (this.isNew) {
    await ClassroomParticipantModel.create({
      classroom: this.id,
      user: this.teacher,
    });
  }
});

module.exports = mongoose.model('Classroom', classroomSchema);
