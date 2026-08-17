// models/Task.js
// This file defines the SHAPE of a "Task" document that gets stored in
// MongoDB. Mongoose calls this a "Schema". Every task saved to the
// database must follow these rules.

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        // title: required, trimmed (removes extra spaces), max 100 characters
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot be longer than 100 characters"]
        },

        // description: optional field
        description: {
            type: String,
            trim: true,
            default: ""
        },

        // isCompleted: boolean flag, defaults to false when a task is created
        isCompleted: {
            type: Boolean,
            default: false
        },

        // dueDate: optional date field
        dueDate: {
            type: Date,
            default: null
        }
    },
    {
        // This automatically adds "createdAt" and "updatedAt" fields
        // and keeps them updated for us — no extra code needed.
        timestamps: true
    }
);

// mongoose.model() turns our schema into a usable "Model".
// Mongoose automatically creates a MongoDB collection called "tasks"
// (lowercase, plural of "Task") and gives every document a unique
// "_id" (ObjectId) automatically — this satisfies the "id" requirement.
module.exports = mongoose.model("Task", taskSchema);
