import Sequelize from 'sequelize'
import { map, prop } from 'ramda'
import {
  PollModel,
  AnswerModel,
  ResponseModel
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
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

const Poll = sequelize.import('poll', PollModel)
const Answer = sequelize.import('answer', AnswerModel)
const Response = sequelize.import('response', ResponseModel)

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
    if (!Array.isArray(model)) {
      const userResponses = await getUserResponsesForPollSelector(model)
      const responsesCount = await getResponsesCountForPollSelector(model)
      const answers = await getAnswersWithResponsesSelector(model)

      model.userResponses = map(prop('answer_id'), userResponses) // eslint-disable-line
      model.responsesCount = responsesCount // eslint-disable-line
      model.fullAnswers = answers // eslint-disable-line
    } else {
      for await (const poll of model) { // eslint-disable-line
        const responsesCount = await getResponsesCountForPollSelector(poll)
        poll.responsesCount = responsesCount // eslint-disable-line
      }
    }
  }
})

export {
  sequelize as default,
  Poll,
  Answer,
  Response,
  getUserResponsesForPollSelector,
  getResponsesCountForPollSelector,
  getAnswersWithResponsesSelector
}
