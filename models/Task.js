// models/Task.js
// this is the shape of a task in the database
// mongodb doesnt really force a shape but mongoose does it for us

const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
    {
        // the title is the only one you HAVE to give
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true, // trim removes extra spaces at the start/end
            maxlength: [100, "Title cannot be longer than 100 characters"]
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        // starts as false since a new task is not done yet
        isCompleted: {
            type: Boolean,
            default: false
        },

        dueDate: {
            type: Date,
            default: null
        }
    },
    {
        // adds createdAt and updatedAt automatically
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);
