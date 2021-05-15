import {
  isNil, compose, omit,
} from 'ramda'
import {
  Model, DataTypes, Sequelize, Optional, ModelCtor,
} from 'sequelize'

interface PollAttributes {
  id: string
  identifier: string
  question: string
  multipleChoice: boolean
  passphrase: string
  isProtected: boolean
  responsesCount: number
  userResponses: number
  fullAnswers: number
  endDate: Date
  ended: boolean
  deleted: boolean
}

interface PollCreationAttributes extends Optional<PollAttributes, 'id' | 'identifier' | 'passphrase' | 'isProtected' | 'responsesCount' | 'userResponses' | 'fullAnswers' | 'endDate'> { } // eslint-disable-line

interface PollInstance extends Model<PollAttributes, PollCreationAttributes>, PollAttributes {
  createdAt?: Date
  updatedAt?: Date
}

const PollFactory = (sequelize: Sequelize): ModelCtor<PollInstance> => {
  const Poll = sequelize.define<PollInstance>(
    'poll',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      multipleChoice: {
        type: DataTypes.BOOLEAN,
        field: 'multiple_choice',
        allowNull: false,
        defaultValue: false,
      },
      passphrase: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isProtected: {
        type: DataTypes.VIRTUAL,
        get() {
          return !isNil(this.passphrase) && this.passphrase !== ''
        },
        set() {
          throw new Error('isProtected is read only')
        },
      },
      responsesCount: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.responsesCount
        },
        set(responsesCount: number) {
          this.setDataValue('responsesCount', responsesCount)
        },
      },
      userResponses: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.userResponses
        },
        set(userResponses: number) {
          this.setDataValue('userResponses', userResponses)
        },
      },
      fullAnswers: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.fullAnswers
        },
        set(fullAnswers: number) {
          this.setDataValue('fullAnswers', fullAnswers)
        },
      },
      endDate: {
        type: DataTypes.DATE,
        field: 'end_date',
        allowNull: true,
      },
      ended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: 'updated',
      freezeTableName: true,
      scopes: {
        excludeDeleted: {
          where: {
            deleted: false,
          },
        },
      },
      hooks: {
        beforeValidate: async (model: PollInstance) => {
          while (isNil(model.identifier)) {
            const identifier = Math.round((36 ** 9) - Math.random() * (36 ** 8)).toString(36).slice(1)
            const existingPoll = await Poll.findOne({ where: { identifier } }) // eslint-disable-line no-await-in-loop
            if (isNil(existingPoll)) {
              model.identifier = identifier // eslint-disable-line no-param-reassign
            }
          }
        },
        afterFind: async (model: PollInstance) => {
          // TODO: This doesn't work when fetching multiple polls
          if (
            !isNil(model)
            && !isNil(model.endDate)
            && model.ended === false
            && new Date(model.endDate).getTime() <= new Date().getTime()
          ) {
            await model.update({ ended: true })
          }
        },
      },
    },
  )

  Poll.prototype.toJSON = function () { // eslint-disable-line func-names
    // const {
    //   responsesCount, userResponses, fullAnswers,
    // } = this

    return compose(
      omit(['passphrase']),
      // assoc('responsesCount', responsesCount),
      // assoc('userResponses', userResponses),
      // assoc('answers', fullAnswers),
    )(this.get({ plain: true }))
  }
  return Poll
}

export default PollFactory
