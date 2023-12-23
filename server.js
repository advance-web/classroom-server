const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Exception handler
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception: server is shutting down');
  process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');

// *Connect to db  for later
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.set('strictQuery', true);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connect successfully');
  });

//Create server with app
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Starting the server at 127.0.0.1:3000');
});

//Exception handler
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection: server is shutting down');
  server.close(() => {
    process.exit(1);
  });
});
