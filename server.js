// server.js
// This is the ENTRY POINT of our app — the file we actually run.
// It wires together: config, database connection, middleware, and routes.

const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// Load variables from .env into process.env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---- Middleware ----
// express.json() lets our app read JSON request bodies (req.body)
// safely. Without this, req.body would be undefined.
app.use(express.json());

// ---- Routes ----
// A simple health-check route so we can confirm the server is alive
app.get("/", (req, res) => {
    res.json({ message: "Todo List API is running 🚀" });
});

// All task-related routes live under /api/tasks
app.use("/api/tasks", taskRoutes);

// ---- Error handling (must be registered AFTER routes) ----
app.use(notFound);     // catches unknown routes -> 404
app.use(errorHandler); // catches thrown/passed errors -> 500 (or 400)

// ---- Start the server ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
