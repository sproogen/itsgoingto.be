import { Model, DataTypes } from 'sequelize'

const poll = (sequelize) => {
  class Poll extends Model {}
  Poll.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    identifier: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    multipleChoice: {
      type: DataTypes.BOOLEAN,
      field: 'multiple_choice',
      allowNull: false,
      defaultValue: false
    },
    passphrase: DataTypes.STRING,
    endDate: {
      type: DataTypes.DATE,
      field: 'end_date',
      allowNull: true
    },
    ended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'updated',
    freezeTableName: true,
    sequelize
  })
  return Poll
}

export default poll
