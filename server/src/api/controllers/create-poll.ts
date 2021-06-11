import { Request, Response } from 'express'
import {
  trim, forEach, isEmpty, defaultTo, map, isNil, omit,
} from 'ramda'
import { Poll, Answer } from '../../db'

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i

interface Body {
  question?: string
  multipleChoice?: boolean
  passphrase?: string
  endDate?: string
  answers?: string[]
}

const createPoll = async (req: Request<never, never, Body, never>, res: Response): Promise<Response> => {
  const question = trim(defaultTo('', req.body.question))
  const multipleChoice = defaultTo(false, req.body.multipleChoice)
  const passphrase = defaultTo(undefined, req.body.passphrase)
  const endDate = defaultTo(undefined, req.body.endDate)
  const answers: string[] = []
  forEach(
    (answer: string) => {
      if (trim(answer).length !== 0) {
        answers.push(answer)
      }
    },
    defaultTo([], req.body.answers),
  )

  const errors: string[] = []

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
    answers: map((answer) => ({ answer }), answers),
  }, {
    include: [{
      model: Answer,
      as: 'answers',
    }],
  })

  return res.json({
    ...omit(
      ['passphrase', 'isProtected'],
      poll.get({ plain: true }),
    ),
    responsesCount: 0,
    answers: await Promise.all(
      map(
        async (answer) => ({
          ...omit(
            ['poll_id'],
            answer.get({ plain: true }),
          ),
          responsesCount: await answer.countResponses(),
        }),
        poll.answers,
      ),
    ),
    userResponses: [],
  })
}

export default createPoll
