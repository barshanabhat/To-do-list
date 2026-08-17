// controllers/taskController.js
// this is where the logic for each route goes
//
// every function follows the same pattern:
// try { talk to the database }
// catch (error) { next(error) } sends it to errorHandler.js

const Task = require("../models/Task");

// -------------------------------
// CREATE - post /api/tasks
// -------------------------------
const createTask = async (req, res, next) => {
    try {
        const { title, description, isCompleted, dueDate } = req.body;

        // checking title here too even though the model already checks it,
        // gives a nicer error message this way
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

        // 201 means something new was created
        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// -------------------------------
// GET ALL - get /api/tasks
// you can also filter like /api/tasks?completed=true
// -------------------------------
const getTasks = async (req, res, next) => {
    try {
        const { completed } = req.query;

        const filter = {};

        // stuff from the url is always text, so compare with "true"
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

// -------------------------------
// GET ONE - get /api/tasks/:id
// -------------------------------
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
        // if the id is not a valid mongodb id mongoose throws a CastError
        // treating that as not found instead of a 500 error
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Task not found (invalid ID format)"
            });
        }
        next(error);
    }
};

// -------------------------------
// UPDATE - put or patch /api/tasks/:id
// im using one function for both of them because i only change the
// things that the user actually sends me
// -------------------------------
const updateTask = async (req, res, next) => {
    try {
        const { title, description, isCompleted, dueDate } = req.body;

        // dont let the title get updated to an empty string
        if (title !== undefined && title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty"
            });
        }

        // only add fields that were actually sent, otherwise the
        // other fields get overwritten with undefined
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (isCompleted !== undefined) updates.isCompleted = isCompleted;
        if (dueDate !== undefined) updates.dueDate = dueDate;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,          // without this it returns the old task
                runValidators: true // so the schema rules still get checked
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

// -------------------------------
// DELETE - delete /api/tasks/:id
// -------------------------------
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
