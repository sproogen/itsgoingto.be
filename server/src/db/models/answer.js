
import { compose, omit, assoc } from 'ramda'
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
  Answer.prototype.toJSON = function () { // eslint-disable-line func-names
    return compose(
      omit(['poll_id']),
      assoc('responsesCount', 0)
    )(this.get({ plain: true }))
  }
  return Answer
}

export default answer
