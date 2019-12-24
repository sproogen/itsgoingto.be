import { isNil } from 'ramda'
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
  Poll.addHook('beforeValidate', async (model) => {
    while (isNil(model.identifier)) {
      const identifier = Math.round((36 ** 9) - Math.random() * (36 ** 8)).toString(36).slice(1)
      const existingPoll = await Poll.findOne({ where: { identifier } }) // eslint-disable-line no-await-in-loop
      if (isNil(existingPoll)) {
        model.identifier = identifier // eslint-disable-line no-param-reassign
      }
    }
  })
  Poll.addHook('afterFind', async (model) => {
    if (
      !isNil(model)
      && !isNil(model.endDate)
      && model.ended === false
      && new Date(model.endDate).getTime() <= new Date().getTime()
    ) {
      await model.update({ ended: true })
    }
  })
  return Poll
}

export default poll
