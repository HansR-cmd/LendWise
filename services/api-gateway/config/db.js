const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/lendwise");
    console.log("MongoDB connected");
  } catch (error) {
    console.warn("MongoDB connection warning (optional for recommendations):", error.message);
  }
};

module.exports = connectDB;