import Sequelize from 'sequelize'
import {
  PollModel,
  AnswerModel,
  ResponseModel,
  UserModel
} from './models'
import {
  getResponsesCountForPoll,
  getUserResponsesForPoll,
  getAnswersWithResponses
} from './selectors'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false,
})

sequelize
  .authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

const Poll = sequelize.import('poll', PollModel)
const Answer = sequelize.import('answer', AnswerModel)
const Response = sequelize.import('response', ResponseModel)
const User = sequelize.import('user', UserModel)

Poll.hasMany(Answer, { foreignKey: 'poll_id', as: 'answers' })
Answer.belongsTo(Poll, { foreignKey: 'poll_id', as: 'poll' })

Poll.hasMany(Response, { foreignKey: 'poll_id', as: 'responses' })
Response.belongsTo(Poll, { foreignKey: 'poll_id', as: 'poll' })

Answer.hasMany(Response, { foreignKey: 'answer_id', as: 'responses' })
Response.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' })

const getResponsesCountForPollSelector = getResponsesCountForPoll(Response)
const getUserResponsesForPollSelector = getUserResponsesForPoll(Response)
const getAnswersWithResponsesSelector = getAnswersWithResponses(Answer, Response)

Poll.addHook('afterFind', async (model) => {
  if (model !== null) {
    if (Array.isArray(model)) {
      for await (const poll of model) { // eslint-disable-line no-restricted-syntax
        const responsesCount = await getResponsesCountForPollSelector(poll)
        poll.responsesCount = responsesCount
      }
    }
  }
})

export {
  sequelize as default,
  Poll,
  Answer,
  Response,
  User,
  getUserResponsesForPollSelector,
  getResponsesCountForPollSelector,
  getAnswersWithResponsesSelector
}
