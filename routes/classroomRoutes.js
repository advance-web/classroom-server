const express = require('express');

const classroomController = require('../controller/classroomController');

const router = express.Router();

router.get('/:id', classroomController.getClassroomById);
router.get('/invite/:id', classroomController.inviteToClassroom);
router.get('/:id/participants', classroomController.getParticipant);

module.exports = router;
