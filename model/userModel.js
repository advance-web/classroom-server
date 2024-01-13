const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ClassroomParticipantModel = require('./classroomParticipantModel');
const PendingInviteModel = require('./pendingInviteModel');
const pendingInviteModel = require('./pendingInviteModel');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: [validator.isEmail, 'Please insert valid email'],
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Password are not the same',
      },
    },
    name: {
      type: String,
      required: [true, 'Please Enter name'],
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      validate: [validator.isMobilePhone, 'Please insert valid phone number'],
    },
    verifyToken: {
      type: String,
      unique: true,
    },
    verify: {
      type: Boolean,
    },
    provider: {
      type: String,
      enum: ['local', 'facebook', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    idMapping: {
      type: String,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.index({ idMapping: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const invitations = await PendingInviteModel.find({
      email: this.email,
      pending: true,
    });
    if (invitations.length) {
      const queries = invitations.map((invitation) =>
        ClassroomParticipantModel.create({
          classroom: invitation.classroom,
          user: this.id,
        })
      );
      const updatePendingQuery = pendingInviteModel.updateMany(
        { email: this.email },
        { $set: { pending: false } }
      );
      await Promise.all([...queries, updatePendingQuery]);
    }
    return next();
  }
  return next();
});

userSchema.methods.checkPassword = async function (checkPass, curPass) {
  return await bcrypt.compare(checkPass, curPass);
};

module.exports = mongoose.model('User', userSchema);
