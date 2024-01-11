const mongoose = require('mongoose');
const dotenv = require('dotenv');
const studentGradeModel = require('../model/studentGradeModel');
const notificationModel = require('../model/notificationModel');
const structureGradeModel = require('../model/structureGradeModel');
const gradeReviewModel = require('../model/gradeReviewModel');
const gradeReviewCommentModel = require('../model/gradeReviewCommentModel');

dotenv.config({ path: '.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await notificationModel.deleteMany();
    await studentGradeModel.deleteMany();
    await structureGradeModel.deleteMany();
    await gradeReviewModel.deleteMany();
    await gradeReviewCommentModel.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

deleteData();
