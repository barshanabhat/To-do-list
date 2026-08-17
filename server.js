// server.js
// this is the main file that runs the app
// everything starts from here (db, middleware, routes)

const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// loads the .env file
dotenv.config();

// connect to the database
connectDB();

const app = express();

// ---- middleware ----
// this lets express read json from the request body
app.use(express.json());

// ---- routes ----
// simple route just to check the server is working
app.get("/", (req, res) => {
    res.json({ message: "Todo List API is running 🚀" });
});

// all task routes start with /api/tasks
app.use("/api/tasks", taskRoutes);

// ---- errors ----
// these need to go after the routes
app.use(notFound);     // for urls that dont exist -> 404
app.use(errorHandler); // for when something breaks -> 500

// ---- start the server ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
