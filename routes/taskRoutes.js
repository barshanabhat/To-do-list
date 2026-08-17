// routes/taskRoutes.js
// connects each url to a function from the controller
// the real logic is in the controller file, this is just a list

const express = require("express");
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

// make a new task
router.post("/", createTask);

// get all the tasks, you can also do ?completed=true
router.get("/", getTasks);

// get only one task using its id
router.get("/:id", getTaskById);

// update a task
router.put("/:id", updateTask);

// update only some parts of a task
// (using the same function for put and patch)
router.patch("/:id", updateTask);

// delete a task
router.delete("/:id", deleteTask);

module.exports = router;
