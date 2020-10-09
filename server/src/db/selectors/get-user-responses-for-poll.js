const getUserResponsesForPoll = (Response) => async (poll, customUserID) => (
  Response.findAll({
    attributes: ['id', 'answer_id'],
    where: {
      poll_id: poll.id,
      customUserID
    }
  })
)

export default getUserResponsesForPoll
