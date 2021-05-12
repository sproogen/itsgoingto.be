import { Model, Optional, DataTypes, Sequelize, ModelCtor } from 'sequelize'

interface AnswerAttributes {
  id: string
  answer: string
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {} // eslint-disable-line

interface AnswerInstance extends Model<AnswerAttributes, AnswerCreationAttributes>, AnswerAttributes {}

const AnswerFactory = (sequelize: Sequelize): ModelCtor<AnswerInstance> => {
  const Answer = sequelize.define<AnswerInstance>(
    'answer',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      answer: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    },
  )
  return Answer
}

export default AnswerFactory
