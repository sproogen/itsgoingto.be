import {
  isNil, compose, omit, assoc
} from 'ramda'
import { Model, DataTypes } from 'sequelize'

const poll = (sequelize) => {
  class Poll extends Model {
    get isProtected() {
      return !isNil(this.passphrase) && this.passphrase !== ''
    }

    get responsesCount() {
      return this._responsesCount // eslint-disable-line
    }

    set responsesCount(responsesCount) {
      this._responsesCount = responsesCount // eslint-disable-line
    }

    get userResponses() {
      return this._userResponses // eslint-disable-line
    }

    set userResponses(userResponses) {
      this._userResponses = userResponses // eslint-disable-line
    }

    get fullAnswers() {
      return this._fullAnswers // eslint-disable-line
    }

    set fullAnswers(answers) {
      this._fullAnswers = answers // eslint-disable-line
    }
  }
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
  Poll.addScope('excludeDeleted', {
    where: {
      deleted: false
    }
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
    // TODO: This doesn't work when fetching multiple polls
    if (
      !isNil(model)
      && !isNil(model.endDate)
      && model.ended === false
      && new Date(model.endDate).getTime() <= new Date().getTime()
    ) {
      await model.update({ ended: true })
    }
  })
  Poll.prototype.toJSON = function () { // eslint-disable-line func-names
    const {
      responsesCount, userResponses, fullAnswers
    } = this

    return compose(
      omit(['id', 'passphrase']),
      assoc('responsesCount', responsesCount),
      assoc('userResponses', userResponses),
      assoc('answers', fullAnswers),
    )(this.get({ plain: true }))
  }
  return Poll
}

export default poll
