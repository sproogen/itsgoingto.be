import { ModelCtor } from 'sequelize'
import { PollInstance } from '../models/poll'
import { ResponseInstance } from '../models/response'

const getUserResponsesForPoll = (Response: ModelCtor<ResponseInstance>, Poll: ModelCtor<PollInstance>) => (
  async (poll: PollInstance, customUserID: string): Promise<ResponseInstance[]> => (
    Response.findAll({
      attributes: ['id', 'answer_id'],
      where: {
        customUserID,
      },
      include: [{
        model: Poll,
        as: 'poll',
        required: true,
        attributes: [],
        where: {
          id: poll.id,
        },
      }],
    })
  )
)

export default getUserResponsesForPoll
