module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Specialties",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
    );
  };
  