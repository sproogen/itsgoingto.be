import { Model, DataTypes } from 'sequelize'

const answer = (sequelize) => {
  class Answer extends Model {}
  return Answer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize
  })
}

export default answer
