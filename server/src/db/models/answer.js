import { Model, DataTypes } from 'sequelize'

const answer = (sequelize) => {
  class Answer extends Model {}
  Answer.init({
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
  return Answer
}

export default answer
