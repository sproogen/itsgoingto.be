import Sequelize from 'sequelize'
import {
  PollModel,
  AnswerModel,
  ResponseModel
} from './models'

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

Poll.hasMany(Answer, { foreignKey: 'poll_id' })
Answer.belongsTo(Poll, { foreignKey: 'poll_id' })

Poll.hasMany(Response, { foreignKey: 'poll_id' })
Response.belongsTo(Poll, { foreignKey: 'poll_id' })

Answer.hasMany(Response, { foreignKey: 'answer_id' })
Response.belongsTo(Answer, { foreignKey: 'answer_id' })

if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ force: true })
    .then(() => Poll.create({
      identifier: 'aaaaaaaa',
      question: 'This is a question?'
    }))
    .then(() => Poll.create({
      question: 'This is another question?'
    }))
    .then(() => {
      console.log('Database & tables created!')
    })
}

export {
  Poll,
  Answer,
  Response
}
