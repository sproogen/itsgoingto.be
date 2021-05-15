import {
  Model, DataTypes, ModelCtor, Sequelize, Optional,
} from 'sequelize'

interface ResponseAttributes {
  id: string
  customUserID: string
}

interface ResponseCreationAttributes extends Optional<ResponseAttributes, 'id'> { } // eslint-disable-line

interface ResponseInstance extends Model<ResponseAttributes, ResponseCreationAttributes>, ResponseAttributes {
  createdAt?: Date
  updatedAt?: Date
}

const ResponseFactory = (sequelize: Sequelize): ModelCtor<ResponseInstance> => sequelize.define<ResponseInstance>(
  'response',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customUserID: {
      type: DataTypes.STRING,
      field: 'custom_user_id',
      // length: 100,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
  },
)

export default ResponseFactory
