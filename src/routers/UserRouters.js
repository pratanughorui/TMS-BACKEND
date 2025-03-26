const express = require("express");
const router = express.Router();
const asyncHandler=require("express-async-handler")
const { Op } = require("sequelize");
const { sequelize, UserEntity } = require("../model");
const successHandler = require("../middleware/successHandler");
const validateTokenHandler = require("../middleware/validateTokenHandler")

router.post("/create", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_name, address, email_id, password, confirm_password } =
      req.body;

    if (!user_name && !address && !email_id && !password && !confirm_password) {
      res.status(400);
      return next(new Error("All fields are required"));
    }

    // ✅ Check if passwords match
    if (password !== confirm_password) {
      res.status(400);
      return next(new Error("Passwords do not match"));
    }

    // ✅ Check if user already exists
    const existingUser = await UserEntity.findOne({
      where: { email_id: email_id },
    });

    if (existingUser) {
      res.status(400);
      return next(new Error("User already exists"));
    }

    // ✅ Create user
    const user= await UserEntity.create(
      {
        user_name: user_name,
        address: address,
        email_id: email_id,
        password: password,
      },
      { transaction }
    );

    // ✅ Commit transaction
    await transaction.commit();
    successHandler(res, 201, "User added successfully",user);
  } catch (error) {
    // ✅ Rollback transaction in case of error
    await transaction.rollback();
    console.error("Error:", error);
    res.status(500);
    return next(new Error("Internal server error"));
  }
});

router.get("/get-all-users", validateTokenHandler,async (req, res, next) => {
  try {
    // Fetch only specific fields (exclude sensitive data like password)
    const users = await UserEntity.findAll({
      attributes: ["user_id", "user_name", "email_id", "address"], // Define fields to return
    });

    // Send response with selected user data
    successHandler(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
});

router.put("/update-user/:id", validateTokenHandler,async (req, res, next) => {
  try {
    const { id } = req.params; // Get user ID from params
    const { user_name, address, email_id } = req.body; // Get updated fields

    // ✅ Validate required fields
    if (!user_name || !address || !email_id) {
      res.status(400);
      return next(
        new Error("All fields (user_name, address, email_id) are required")
      );
    }

    // ✅ Check if user exists
    const user = await UserEntity.findByPk(id);
    if (!user) {
      res.status(404);
      return next(new Error(`User with ID ${id} not found`));
    }

    // ✅ Check if the new email already exists (but ignore the current user's email)
    const existingUser = await UserEntity.findOne({
      where: {
        email_id: email_id,
        user_id: { [Op.ne]: id }, // "Op.ne" means "not equal"
      },
    });

    if (existingUser) {
      res.status(400);
      return next(new Error("Email is already in use by another user"));
    }

    // ✅ Update user details
    await user.update({
      user_name,
      address,
      email_id,
    });

    // ✅ Send success response
    successHandler(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

module.exports = router;
