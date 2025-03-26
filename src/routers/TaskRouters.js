const express = require("express");
const router = express.Router();
const validateTokenHandler=require("../middleware/validateTokenHandler");
const { sequelize, TaskEntity } = require("../model");
const successHandler = require("../middleware/successHandler")

// endpoint : api/task/create
// Route to create a new task
router.post("/create", validateTokenHandler, async (req, res, next) => {
    try { 
        // ✅ Extract data from request body
        const { task_description, completion_date } = req.body;
        const user_id = req.user.userId; // Extract userId from decoded token
        
        // ✅ Check if task_description is provided
        if (!task_description || !completion_date) {
            res.status(400);
            return next(new Error("Data is required"));
        }

        // ✅ Create a new task
        const newTask = await TaskEntity.create({
            task_description,
            completion_date, // Ensure the format is correct in frontend (YYYY-MM-DD)
            created_by: user_id
        });

        // ✅ Send success response
        successHandler(res, 201, "Task created successfully", newTask);
        
    } catch (error) {
        next(error); // ✅ Pass error to global error handler
    }
});

// endpoint : api/task/update
// Route to update a task by ID
router.put("/update/:id", validateTokenHandler, async (req, res, next) => {
    try {
        const { id } = req.params; // ✅ Extract task ID from request parameters
        const { task_description, completion_date, is_completed } = req.body; // ✅ Extract fields from request body
        const user_id=req.user.userId; // ✅ Get logged-in user ID

        // ✅ Find task by primary key
        const task = await TaskEntity.findByPk(id);

        // ✅ If task not found, return 404 error
        if (!task) {
            res.status(404);
            return next(new Error("Task not found"));
        }

        // ✅ Check if the logged-in user is the creator of the task
        if (task.created_by !== user_id) {
            res.status(403);
            return next(new Error("You are not authorized to modify this task"));
        }

        // ✅ Update task details
        const updatedTask = await task.update({
            task_description,
            completion_date,
            is_completed
        });

        // ✅ Send success response
        successHandler(res, 200, "Task updated successfully", updatedTask);
        
    } catch (error) {
        next(error); // ✅ Pass error to global error handler
    }
});



module.exports=router