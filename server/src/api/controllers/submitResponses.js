import {
  isEmpty, defaultTo, isNil, is, pipe, unless, append, __, reduceWhile, pathEq, find, map, prop
} from 'ramda'
import { Op } from 'sequelize'
import { Poll, Response } from '../../db'

// TODO: Get USERID from cookies
// TODO: Push new responses to socket

const submitResponses = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
      ended: false
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

  if (!isEmpty(errors)) {
    return res.status(400).send({ errors })
  }

  const customUserID = '00000'
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  await Response.destroy({
    where: {
      poll_id: poll.id,
      customUserID,
      answer_id: {
        [Op.notIn]: map(prop('id'), answers)
      }
    }
  })

  for await(const answer of answers) { // eslint-disable-line
    let response = await Response.findOne({
      where: {
        poll_id: poll.id,
        answer_id: answer.id,
        customUserID
      },
    })

    if (isNil(response)) {
      response = await Response.create({ // eslint-disable-line
        customUserID,
        userIP
      })

      await poll.addResponse(response) // eslint-disable-line
      await answer.addResponse(response) // eslint-disable-line
    }
  }

  const response = await Poll.findOne({
    attributes: ['id'],
    where: {
      id: poll.id,
    }
  })

  return res.json(response)
}

export default submitResponses
