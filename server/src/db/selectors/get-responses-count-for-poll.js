const getResponsesCountForPoll = (Response) => async (poll) => (
  Response.count({
    where: {
      poll_id: poll.id,
    }
  })
)

export default getResponsesCountForPoll
