module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "Prescription",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        content: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        medical_history_id: {
          type: DataTypes.UUID,
          allowNull: false,  
        },
      },
    );
  };
  