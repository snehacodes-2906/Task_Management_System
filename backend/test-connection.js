require('dotenv').config();

const mongoose = require('mongoose');


async function testConnection() {

  try {

    console.log('Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully');

    console.log(
      'Database:',
      mongoose.connection.db.databaseName
    );


    await mongoose.disconnect();

    console.log('Connection closed');

  } catch (error) {

    console.log(
      'MongoDB connection failed:',
      error.message
    );

  }

}


testConnection();