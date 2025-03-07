module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Medical_History",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        patient_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        diagnosis: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        doctor_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        notes: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
    );
  };
  