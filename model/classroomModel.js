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

classroomSchema.methods.signTeacherInClass = async function () {
  try {
    console.log(this);
    await ClassroomParticipantModel.create({
      classroom: this.id,
      user: this.teacher.toString(),
    });
  } catch (error) {
    console.log(this);
    console.error(error);
  }
};
classroomSchema.queue('signTeacherInClass', []);

module.exports = mongoose.model('Classroom', classroomSchema);
