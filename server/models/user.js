module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Users",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM("admin", "doctor", "patient"),
          allowNull: false,
        },
      },
    );
  };
  