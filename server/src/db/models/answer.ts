import {
  Model, Optional, DataTypes, Sequelize, ModelCtor, HasManyCountAssociationsMixin, HasManyAddAssociationMixin,
} from 'sequelize'
import { ResponseInstance } from './response'

interface AnswerAttributes {
  id: string
  answer: string
}

export interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {} // eslint-disable-line

export interface AnswerInstance extends Model<AnswerAttributes, AnswerCreationAttributes>, AnswerAttributes {
  countResponses: HasManyCountAssociationsMixin
  addResponse: HasManyAddAssociationMixin<ResponseInstance, number>
}

const AnswerFactory = (sequelize: Sequelize): ModelCtor<AnswerInstance> => sequelize.define<AnswerInstance>(
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

export default AnswerFactory
