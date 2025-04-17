const Todo = require("../models/todoModels");

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);

    } catch (err) {
        res.status(500).json({message : err.message})
    }
}

exports.createTodo = async (req, res) => {
    try {
        const { description, dueDate, priority, category, subject, notes, estimatedTime, progress } = req.body;

        if (!description) return res.status(400).json({message: "Please provide a description"});
        if (!dueDate) return res.status(400).json({message: "Please provide a due date"});
        if (!category) return res.status(400).json({message: "Please provide a category"});
        if (!subject) return res.status(400).json({message: "Please provide a subject"});

        const newTodo = new Todo({
            description,
            dueDate,
            priority: priority || 'Medium',
            category,
            subject,
            notes: notes || '',
            estimatedTime: estimatedTime || 60,
            progress: progress || 0,
            completed: false,
        });

        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(500).json({message: err.message});
    }
}

exports.updateTodo = async (req, res) => {
    try {
        const {id} = req.params;
        const { description, dueDate, priority, category, subject, notes, estimatedTime, progress, completed } = req.body;

        const updates = {};
        
        // Only include fields that are provided in the request
        if (description !== undefined) updates.description = description;
        if (dueDate !== undefined) updates.dueDate = dueDate;
        if (priority !== undefined) updates.priority = priority;
        if (category !== undefined) updates.category = category;
        if (subject !== undefined) updates.subject = subject;
        if (notes !== undefined) updates.notes = notes;
        if (estimatedTime !== undefined) updates.estimatedTime = estimatedTime;
        if (progress !== undefined) updates.progress = progress;
        if (completed !== undefined) updates.completed = completed;
        
        const updatedTodo = await Todo.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedTodo) return res.status(404).json({message: "Todo not found"});

        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({message: err.message});
    }
}

exports.deleteTodo = async (req, res) => {
    try {
        const {id} = req.params;

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) return res.status(404).json({message: "Todo not found"});

        res.status(200).json({message: "Todo deleted successfully"});
    } catch (err) {
        res.status(500).json({message : err.message});
    }
}

exports.getOverdueTodos = async (req, res) => {
    try {
        const currentDate = new Date();
        const todos = await Todo.find({
            dueDate: { $lt: currentDate },
            completed: false
        });
        res.status(200).json(todos);
    } catch (err) {
        console.error("Error fetching overdue todos:", err);
        res.status(500).json({message: err.message});
    }
}