module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Doctors_Data",
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
     },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialty_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
      },
    },
  );
};
