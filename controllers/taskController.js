// controllers/taskController.js
// A "controller" holds the actual logic for what happens when a request
// hits an endpoint. Routes just point to these functions.
//
// Every function below follows the same pattern:
// 1. try { ... do the database work ... }
// 2. catch (error) { next(error) }  -> this passes the error to our
//    global error handler (middleware/errorHandler.js) instead of
//    crashing the server or leaking a raw stack trace to the client.

const Task = require("../models/Task");

// ------------------------------------------------------------------
// CREATE  ->  POST /api/tasks
// ------------------------------------------------------------------
const createTask = async (req, res, next) => {
    try {
        const { title, description, isCompleted, dueDate } = req.body;

        // Basic validation: title is required (schema also enforces this,
        // but checking here lets us return a clean 400 error message
        // instead of a generic Mongoose validation error).
        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            isCompleted,
            dueDate
        });

        // 201 Created = a new resource was successfully made
        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------------------------------
// READ ALL  ->  GET /api/tasks
// Supports optional filtering:  GET /api/tasks?completed=true
// ------------------------------------------------------------------
const getTasks = async (req, res, next) => {
    try {
        const { completed } = req.query;

        const filter = {};

        // req.query values are always strings, so we compare to "true"
        if (completed !== undefined) {
            filter.isCompleted = completed === "true";
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

// ------------------------------------------------------------------
// READ ONE  ->  GET /api/tasks/:id
// ------------------------------------------------------------------
const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        // If the ID is not a valid MongoDB ObjectId format, Mongoose
        // throws a "CastError". We treat that the same as "not found"
        // instead of a scary 500 error.
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Task not found (invalid ID format)"
            });
        }
        next(error);
    }
};

// ------------------------------------------------------------------
// UPDATE  ->  PUT /api/tasks/:id  or  PATCH /api/tasks/:id
// PUT and PATCH share the same logic here because we only update the
// fields that were actually sent in the request body.
// ------------------------------------------------------------------
const updateTask = async (req, res, next) => {
    try {
        const { title, description, isCompleted, dueDate } = req.body;

        // If the client is trying to update the title, make sure it's
        // not being set to an empty string.
        if (title !== undefined && title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty"
            });
        }

        // Only include fields that were actually provided, so PATCH-style
        // partial updates don't accidentally wipe out other fields.
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (isCompleted !== undefined) updates.isCompleted = isCompleted;
        if (dueDate !== undefined) updates.dueDate = dueDate;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,          // return the UPDATED document, not the old one
                runValidators: true // re-run schema validation (e.g. maxlength)
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Task not found (invalid ID format)"
            });
        }
        next(error);
    }
};

// ------------------------------------------------------------------
// DELETE  ->  DELETE /api/tasks/:id
// ------------------------------------------------------------------
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Task not found (invalid ID format)"
            });
        }
        next(error);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
