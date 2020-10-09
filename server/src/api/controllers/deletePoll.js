import { isNil } from 'ramda'
import { Poll, getResponsesCountForPollSelector } from '../../db'

const deletePoll = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
    }
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'poll-not-found' })
  }

  if (poll.deleted === true) {
    return res.status(400).send({ error: 'poll-already-deleted' })
  }

  await poll.update({ deleted: true })

  poll.responsesCount = await getResponsesCountForPollSelector(poll)

  return res.json(poll)
}

export default deletePoll
