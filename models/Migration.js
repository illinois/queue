module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'migration',
    {
      index: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      filename: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      appliedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      timestamps: false,
    }
  )

  obj.associate = () => {}

  return obj
}
