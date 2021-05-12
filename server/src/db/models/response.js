import { Model, DataTypes } from 'sequelize'

const ResponseFactory = (sequelize) => {
  class Response extends Model {}
  return Response.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customUserID: {
      type: DataTypes.STRING,
      field: 'custom_user_id',
      length: 100,
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
    modelName: 'response',
    sequelize,
  })
}

export default ResponseFactory
