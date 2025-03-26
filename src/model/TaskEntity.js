module.exports = (sequelize, DataTypes) => {
  const TaskEntity = sequelize.define(
    "TaskEntity",
    {
      task_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false 

      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "task", //✅ Explicit table name
      timestamps: true, // ✅ Adds `createdAt` & `updatedAt` fields
    }
  );
  return TaskEntity;
};
