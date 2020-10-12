import {
  trim, forEach, isEmpty, defaultTo, map, isNil
} from 'ramda'
import {
  Poll,
  getUserResponsesForPollSelector,
  getResponsesCountForPollSelector,
  getAnswersWithResponsesSelector
} from '../../db'

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i

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
  if (!isNil(endDate) && ISO_8601_FULL.test(endDate) === false) {
    errors.push('Invalid end date format')
  }

  if (!isEmpty(errors)) {
    return res.status(400).send({ errors })
  }

  const poll = await Poll.create({
    question,
    multipleChoice,
    passphrase,
    endDate,
    answers: map((answer) => ({ answer }), answers)
  }, {
    include: ['answers']
  })

  poll.userResponses = []
  poll.responsesCount = await getResponsesCountForPollSelector(poll)
  poll.fullAnswers = await getAnswersWithResponsesSelector(poll)

  return res.json(poll)
}

export default createPoll
