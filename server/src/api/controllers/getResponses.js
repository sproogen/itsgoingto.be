import {
  defaultTo, isNil, map, prop
} from 'ramda'
import {
  Poll,
  getUserResponsesForPollSelector,
  getResponsesCountForPollSelector,
  getAnswersWithResponsesSelector
} from '../../db'

// TODO: Swagger docs

const getResponses = async (req, res) => {
  const poll = await Poll.scope([...(req.user ? [] : ['excludeDeleted'])]).findOne({
    attributes: ['id', 'passphrase', 'ended'],
    where: {
      identifier: req.params.identifier,
    },
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'poll-not-found' })
  }

  if (
    poll.isProtected
    && poll.passphrase !== defaultTo('', req.query.passphrase)
  ) {
    return res.status(403).send({ error: 'incorrect-passphrase' })
  }

  const customUserID = req.cookies.USERID
  if (customUserID) {
    poll.userResponses = map(prop('answer_id'), await getUserResponsesForPollSelector(poll, customUserID))
  } else {
    poll.userResponses = []
  }
  poll.responsesCount = await getResponsesCountForPollSelector(poll)
  poll.fullAnswers = await getAnswersWithResponsesSelector(poll)

  return res.json(poll)
}

export default getResponses
