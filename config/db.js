// config/db.js
// This file is responsible for ONE job only: connecting our app to MongoDB.
// Keeping it separate (instead of writing this code inside server.js) is
// good practice — it's called "separation of concerns".

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // mongoose.connect() returns a Promise, so we "await" it.
        // process.env.MONGO_URI comes from our .env file.
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        // If the connection fails (wrong password, no internet, etc.)
        // we log the error and stop the app, because the API is useless
        // without a database.
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
