module.exports = (sequelize, DataTypes,bcrypt) => {
  const UserEntity = sequelize.define(
    "UserEntity",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "user", //✅ Explicit table name
      timestamps: true, // ✅ Adds `createdAt` & `updatedAt` fields
    });
    UserEntity.beforeCreate(async (user, options) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    })
  return UserEntity;
};
