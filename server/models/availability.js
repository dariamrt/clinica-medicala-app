module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Availabilities",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      doctor_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      appointment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["doctor_id", "date", "start_time", "end_time"],
          name: "unique_availability_per_doctor_per_period",
        },
      ]
    }
  );
};
