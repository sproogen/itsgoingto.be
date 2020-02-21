import { map, prop } from 'ramda'
import Sequelize from 'sequelize'
import { Response, Answer } from '../../db'

const generateAnswersResponse =  async (poll, customUserID) => {
  const userResponses = await Response.findAll({
    attributes: ['id', 'answer_id'],
    where: {
      poll_id: poll.id,
      customUserID
    }
  })
  const responsesCount = await Response.count({
    where: {
      poll_id: poll.id,
    }
  })
  const answers = await Answer.findAll({
    where: {
      poll_id: poll.id,
    },
    include: [{
      model: Response,
      as: 'responses',
      attributes: [],
    }],
    attributes: {
      exclude: ['poll_id'],
      include: [[
        Sequelize.literal(
          '(SELECT COUNT(*) FROM `Response` AS `responses` WHERE `responses`.`answer_id` = `Answer`.`id`)'
        ),
        'responsesCount'
      ]]
    },
    group: ['Answer.id']
  })

  return {
    userResponses: map(prop('answer_id'), userResponses),
    responsesCount,
    answers
  }
}

export default generateAnswersResponse
