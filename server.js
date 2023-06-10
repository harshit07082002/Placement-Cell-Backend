const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((res) => {
    console.log('✅ Connection Succesful with Database!!');
  })
  .catch((e) => {
    console.log('💥 Error while establishing connection with Database!!');
  });

const server = app.listen(process.env.PORT, () => {
  console.log('Server Started');
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});