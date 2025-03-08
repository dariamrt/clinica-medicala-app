module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Admin_Reports", {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
      },
      report_type: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      content: {
          type: DataTypes.JSON,
          allowNull: false,
      },
      created_by_user_id: {
          type: DataTypes.UUID,
          allowNull: false,
      },
      format: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "json",
      },
  });
};
