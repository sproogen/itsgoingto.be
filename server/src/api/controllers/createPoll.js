import {
  trim, forEach, isEmpty, defaultTo, map
} from 'ramda'
import { Poll, Answer } from '../../db'

const createPoll = async (req, res) => {
  const question = trim(defaultTo('', req.body.question))
  const multipleChoice = defaultTo(false, req.body.multipleChoice)
  const passphrase = defaultTo(null, req.body.passphrase)
  const endDate = defaultTo(null, req.body.endDate)
  const answers = []
  forEach((answer) => {
    if (trim(answer).length !== 0) {
      answers.push(answer)
    }
  }, defaultTo([], req.body.answers))

  const errors = []

  if (question.length === 0) {
    errors.push('No question has been provided')
  }
  if (answers.length === 0) {
    errors.push('No answers have been provided')
  }
  // TODO: Validate endDate

  if (!isEmpty(errors)) {
    return res.status(400).send({ errors })
  }

  const poll = await Poll.create({
    question,
    multipleChoice,
    passphrase,
    endDate,
    Answers: map((answer) => ({ answer }), answers)
  }, {
    include: [Answer]
  })

  // TODO: Fix poll response
  return res.json(poll)
}

export default createPoll
