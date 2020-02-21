const getUserResponsesForPoll = (Response) => async (poll) => {
  console.log('getUserResponsesForPoll', poll)
  return Response.findAll({
    attributes: ['id', 'answer_id'],
    where: {
      poll_id: poll.id,
      customUserID: '00000' // TODO: Get this from cookie
    }
  })
}

export default getUserResponsesForPoll
