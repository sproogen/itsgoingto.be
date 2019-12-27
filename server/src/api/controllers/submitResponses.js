import {
  isEmpty, defaultTo, isNil, is
} from 'ramda'
import { Poll, Answer } from '../../db'


const submitResponses = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
      deleted: false,
      ended: false
    }
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'poll-not-found' })
  }

  // TODO: Allow admin to bypass passphrase
  if (
    poll.isProtected
    && poll.passphrase !== defaultTo('', req.query.passphrase)
  ) {
    return res.status(403).send({ error: 'incorrect-passphrase' })
  }

  if (poll.ended === true) {
    return res.status(400).send({ error: 'poll-ended' })
  }

  let answerIds = defaultTo([], req.body.answers)
  if (!is(Array, answerIds)) {
    answerIds = [answerIds]
  }

  console.log('answerIds', answerIds)

  // TODO: Refactor this
  const answers = []
  for (const id of answerIds) {
    if (is(Number, id) && (!poll.multipleChoice || isEmpty(answers))) {
      const answer = await Answer.findOne({
        where: {
          id,
          poll_id: poll.id,
        }
      })
      console.log('answer', answer)
      if (!isNil(answer)) {
        answers.push(answer)
      }
    }
  }

  console.log('answers', answers)

  const errors = []

  if (answers.length === 0) {
    errors.push('No answers have been provided')
  }

  if (!isEmpty(errors)) {
    return res.status(400).send({ errors })
  }

  // TODO: Remove / Add reponses

  // TODO: Push new responses to socket

  return res.json({ yoo: '' })
}

export default submitResponses
