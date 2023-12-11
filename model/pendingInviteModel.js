const mongoose = require('mongoose');

const pendingInviteSchema = new mongoose.Schema(
  {
    classroom: {
      type: String,
      required: [true, 'Invitation must in a classroom'],
    },
    email: {
      type: String,
      required: [true, 'Invitation must have destination email'],
    },
    pending: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

pendingInviteSchema.index({ classroom: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('PendingInvite', pendingInviteSchema);
