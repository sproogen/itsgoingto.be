import Sequelize from 'sequelize'

const getAnswersWithResponses = (Answer, Response) => async (poll) => (
  Answer.findAll({
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
          '(SELECT COUNT(*) FROM `response` AS `responses` WHERE `responses`.`answer_id` = `answer`.`id`)'
        ),
        'responsesCount'
      ]]
    },
    group: ['answer.id']
  })
)

export default getAnswersWithResponses
