module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Patients_Data",
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
        CNP: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        gender: {
          type: DataTypes.ENUM("male", "female", "other"),
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
    );
  };
  