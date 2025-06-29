const mongoose = require("mongoose");
const deleteUnverifiedUsers = require("../Utils/cron");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);

    deleteUnverifiedUsers();

    console.log("connection successful: " + connect.connection.host);
  } catch (error) {
    console.log("Connection error", error);
    process.exit(1);
  }
};

module.exports = connectDb;
