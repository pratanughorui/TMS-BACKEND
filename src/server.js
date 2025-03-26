const express = require("express");
const db = require("./model");
require('dotenv').config();
require("./jobs/taskReminderJob")
const errorHandler=require('./middleware/errorHandler')
const AuthRouters = require("./routers/AuthRouters");
const TaskRouters = require("./routers/TaskRouters");
const UserRouters = require("./routers/UserRouters");
const app = express();
app.use(express.json());

app.use("/api/user", UserRouters);
app.use('/api/auth',AuthRouters)
app.use('/api/task',TaskRouters)
app.use(errorHandler);

// Check Database Connection & Sync Models
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    await db.sequelize.sync({ alter: true });
    console.log("✅ Models synchronized.");

    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
  }
};

startServer();
