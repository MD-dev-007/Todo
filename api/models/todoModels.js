const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium',
        },
        category: {
            type: String,
            enum: ['Assignment', 'Exam', 'Project', 'Lecture', 'Study', 'Other'],
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        estimatedTime: {
            type: Number, // in minutes
            default: 60,
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Todo", todoSchema);