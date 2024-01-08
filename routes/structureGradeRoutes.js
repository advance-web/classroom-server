const express = require('express');

const authController = require('../controller/authController');
const structureGradeController = require('../controller/structureGradeController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('teacher'));
router.delete('/:id', structureGradeController.deleteStructureGrade);
router.patch('/:id', structureGradeController.updateStructureGrade);
router.patch('/:id/sort', structureGradeController.sortStructureGrade);

module.exports = router;
