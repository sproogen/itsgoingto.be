import {
  isEmpty, defaultTo, isNil, is, pipe, unless, append, __, reduceWhile, pathEq, find, map, prop
} from 'ramda'
import { Op } from 'sequelize'
import {
  Poll,
  Response,
  getUserResponsesForPollSelector,
  getResponsesCountForPollSelector,
  getAnswersWithResponsesSelector
} from '../../db'

const submitResponses = (io) => async (req, res) => {
  let poll = await Poll.scope(['excludeDeleted']).findOne({
    attributes: ['id', 'passphrase', 'multipleChoice', 'ended'],
    where: {
      identifier: req.params.identifier,
    },
    include: ['answers']
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

  if (poll.ended === true) {
    return res.status(400).send({ error: 'poll-ended' })
  }

  const answers = pipe(
    defaultTo([]),
    unless(
      is(Array),
      append(__, [])
    ),
    reduceWhile(
      (acc) => poll.multipleChoice || isEmpty(acc),
      (acc, answerId) => {
        const answer = find(pathEq(['dataValues', 'id'], answerId), poll.answers)
        if (!isNil(answer)) {
          return append(answer, acc)
        }
        return acc
      },
      []
    )
  )(req.body.answers)

  const errors = []

  if (answers.length === 0 && !poll.multipleChoice) {
    errors.push('No answers have been provided')
  }

  const customUserID = req.cookies.USERID
  if (!customUserID) {
    errors.push('USERID is required')
  }

  if (!isEmpty(errors)) {
    return res.status(400).send({ errors })
  }

  await Response.destroy({
    where: {
      poll_id: poll.id,
      customUserID,
      answer_id: {
        [Op.notIn]: map(prop('id'), answers)
      }
    }
  })

  for await (const answer of answers) { // eslint-disable-line no-restricted-syntax
    let response = await Response.findOne({
      where: {
        poll_id: poll.id,
        answer_id: answer.id,
        customUserID
      },
    })

    if (isNil(response)) {
      response = await Response.create({
        customUserID,
      })

      await poll.addResponse(response)
      await answer.addResponse(response)
    }
  }

  poll = await Poll.findOne({
    attributes: ['id', 'ended'],
    where: {
      id: poll.id,
    }
  })

  poll.userResponses = map(prop('answer_id'), await getUserResponsesForPollSelector(poll, customUserID))
  poll.responsesCount = await getResponsesCountForPollSelector(poll)
  poll.fullAnswers = await getAnswersWithResponsesSelector(poll)

  const responseAsJson = JSON.parse(JSON.stringify(poll))
  io.of('/responses').to(`${req.params.identifier}/${customUserID}`).emit('own-responses-updated', responseAsJson)
  io.of('/responses').to(req.params.identifier).emit('responses-updated', responseAsJson)

  return res.json(poll)
}

export default submitResponses
