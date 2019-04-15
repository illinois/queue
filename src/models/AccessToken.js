module.exports = (sequelize, DataTypes) => {
  const obj = sequelize.define(
    'accessToken',
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ['userId'],
        },
      },
    }
  )

  obj.associate = models => {
    models.AccessToken.belongsTo(models.User)
  }

  return obj
}
