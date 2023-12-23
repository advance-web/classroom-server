const ClassroomParticipantModel = require('../model/classroomParticipantModel');
const UserModel = require('../model/userModel');
const PendingInviteModel = require('../model/pendingInviteModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

exports.teacherDoingAction = (req, res, next) => {
  req.body.teacher = req.user.id;
  next();
};

exports.inviteByEmail = catchAsync(async (req, res, next) => {
  const { email, classroom } = req.body;
  const teacher = req.user.id;
  const Sender = new Email({ email, name: 'Người mới' });

  // Check teacher in classroom
  const participant = await ClassroomParticipantModel.findOne({
    classroom,
    user: teacher,
  });
  if (!participant) {
    return next(new AppError(400, 'Please join class to invite people'));
  }

  // Check user in app ?
  const inviteUser = await UserModel.findOne({ email }, 'id name role email');

  // No: Create pending invite, send register request done
  if (!inviteUser) {
    // Create new pending invite
    const newPendingInvite = await PendingInviteModel.create({
      classroom,
      email,
    });

    // Send email
    await Sender.sendRegisterationRequest();
    return res.status(200).json({ status: 'success', data: newPendingInvite });
  }

  // Yes: Add to class participant, send added success email
  const newParticipant = await ClassroomParticipantModel.create({
    classroom,
    user: inviteUser.id,
  });

  await Sender.sendAddedToClassroom(classroom);

  res.status(200).json({
    status: 'success',
    data: {
      newParticipant,
      inviteUser,
    },
  });
});
