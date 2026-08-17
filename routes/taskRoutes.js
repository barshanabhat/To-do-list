// routes/taskRoutes.js
// This file maps each HTTP method + URL to the controller function
// that should handle it. It's like a "menu" of endpoints.

const express = require("express");
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

// POST   /api/tasks        -> create a new task
router.post("/", createTask);

// GET    /api/tasks        -> get all tasks (supports ?completed=true)
router.get("/", getTasks);

// GET    /api/tasks/:id    -> get one task by its ID
router.get("/:id", getTaskById);

// PUT    /api/tasks/:id    -> full update of a task
router.put("/:id", updateTask);

// PATCH  /api/tasks/:id    -> partial update of a task
router.patch("/:id", updateTask);

// DELETE /api/tasks/:id    -> delete a task
router.delete("/:id", deleteTask);

module.exports = router;
