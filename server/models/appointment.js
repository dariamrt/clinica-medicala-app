module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Appointments",
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
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        allowNull: false,
      },
      reimbursed_by_CAS: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
  );
};
