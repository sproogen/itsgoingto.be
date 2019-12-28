import {
  isEmpty, defaultTo, isNil, is, pipe, unless, append, __, reduceWhile, pathEq, find
} from 'ramda'
import { Poll, Response } from '../../db'


const submitResponses = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
      deleted: false,
      ended: false
    },
    include: ['answers']
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

  // TODO: User identifiers
  const customUserID = '0'
  const userIP = '0.0.0.0'

  if (poll.multipleChoice) {
    // TODO: Remove / Add reponses
  } else {
    let response = await Response.findOne({
      where: {
        poll_id: poll.id,
        customUserID
      },
    })

    if (isNil(response)) {
      response = await Response.create({
        customUserID,
        userIP
      })
      await poll.addResponse(response)
    }

    await answers[0].addResponse(response)
  }
  // for(const answer of answers) { // eslint-disable-line
  //   await Response.create({ // eslint-disable-line
  //     poll,
  //     answer,
  //     customUserID,
  //     userIP
  //   })
  // }

  // TODO: Push new responses to socket

  // TODO: Generate user responses
  const userResponses = await Response.findAndCountAll()
  return res.json(userResponses)
}

export default submitResponses
