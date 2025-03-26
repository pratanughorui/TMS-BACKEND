const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

// import models
const UserEntity = require('../model/UserEntity')(sequelize,DataTypes,bcrypt);
const TaskEntity = require('../model/TaskEntity')(sequelize,DataTypes);

// Define associations

// This tells Sequelize that a single user can have multiple tasks.
UserEntity.hasMany(TaskEntity, { 
    foreignKey: "created_by",  // This is the foreign key in TaskEntity
    sourceKey: "user_id",      // This is the primary key in UserEntity
    onDelete: "CASCADE"        // Optional: Deletes tasks if the user is deleted
});

// This tells Sequelize that the created_by column in TaskEntity is a foreign key referencing user_id in UserEntity.
TaskEntity.belongsTo(UserEntity, { 
    foreignKey: "created_by",  // Foreign key in TaskEntity
    targetKey: "user_id"       // References user_id in UserEntity
});


// Export models
const db = { sequelize, UserEntity, TaskEntity};

module.exports = db;