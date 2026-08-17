// config/db.js
// this file just connects to mongodb
// keeping it separate from server.js because thats what the tutorial did

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // connect returns a promise so need await here
        // MONGO_URI is in the .env file
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        // if it fails just print the error and stop the app
        // no point running without a database i think
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
