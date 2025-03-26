const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const successHandler = require("../middleware/successHandler");
const validateToken = require("../middleware/validateTokenHandler");
const { sequelize, UserEntity } = require("../model");

router.post("/login", async (req, res, next) => {
  try {
    const { email_id, password } = req.body;
    if (!email_id || !password) {
      res.status(400);
      return next(new Error("All fields are required"));
    }
    const existingUser = await UserEntity.findOne({
      where: { email_id: email_id },
    });
    if (!existingUser) {
      res.status(404);
      return next(new Error("User not exists"));
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      res.status(401);
      return next(new Error("Invalid credentials"));
    }

    const token = jwt.sign(
      { userId: existingUser.user_id, email: existingUser.email_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return successHandler(
      res,
      200,
      "Login successful",
      {
        user_id: existingUser.user_id,
        user_name: existingUser.user_name,
        email_id: existingUser.email_id,
      },
      token
    );
  } catch (error) {
    next(error);
  }
});

router.get("/current", validateToken, async (req, res, next) => {
  try {
    return successHandler(res, 200, "Fetched successful", req.user);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
