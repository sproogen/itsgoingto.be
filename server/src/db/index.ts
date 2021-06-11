import { Sequelize } from 'sequelize'
import {
  PollFactory,
  AnswerFactory,
  ResponseFactory,
  UserFactory,
  generateJWT,
  validatePassword,
} from './models'
import {
  getUserResponsesForPoll,
} from './selectors'

const DATABASE_URL = process.env.DATABASE_URL || ''

const sequelize = new Sequelize(DATABASE_URL, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
})

sequelize
  .authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

const Poll = PollFactory(sequelize)
const Answer = AnswerFactory(sequelize)
const Response = ResponseFactory(sequelize)
const User = UserFactory(sequelize)

Poll.hasMany(Answer, { foreignKey: 'poll_id', as: 'answers' })
Answer.belongsTo(Poll, { foreignKey: 'poll_id', as: 'poll' })

Poll.hasMany(Response, { foreignKey: 'poll_id', as: 'responses' })
Response.belongsTo(Poll, { foreignKey: 'poll_id', as: 'poll' })

Answer.hasMany(Response, { foreignKey: 'answer_id', as: 'responses' })
Response.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' })

const getUserResponsesForPollSelector = getUserResponsesForPoll(Response, Poll)

export {
  sequelize as default,
  Poll,
  Answer,
  Response,
  User,
  generateJWT,
  validatePassword,
  getUserResponsesForPollSelector,
}
