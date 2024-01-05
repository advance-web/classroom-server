const mongoose = require('mongoose');
const dotenv = require('dotenv');
const studentGradeModel = require('../model/studentGradeModel');

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
    await studentGradeModel.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

deleteData();
