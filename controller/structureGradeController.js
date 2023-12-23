const factory = require('./factoryHandler');
const structureGradeModel = require('../model/structureGradeModel');

exports.createStructureGrade = factory.createOne(structureGradeModel);
exports.updateStructureGrade = factory.updateOne(structureGradeModel);
