import { Request, Response } from 'express'
import {
  isNil, defaultTo, map, omit, prop,
} from 'ramda'
import {
  Poll,
  Answer,
  getUserResponsesForPollSelector,
} from '../../db'

type Params = {
  identifier: string
}

type Query = {
  passphrase?: string
}

const getPoll = async (req: Request<Params, never, never, Query>, res: Response): Promise<Response> => {
  const poll = await Poll.scope([...(req.user ? [] : ['excludeDeleted'])]).findOne({
    where: {
      identifier: req.params.identifier,
    },
    include: [{
      model: Answer,
      as: 'answers',
      attributes: { exclude: ['poll_id'] },
    }],
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'poll-not-found' })
  }

  if (
    poll.isProtected
    && poll.passphrase !== defaultTo('', req.query.passphrase)
    && !req.user
  ) {
    return res.status(403).send({ error: 'incorrect-passphrase' })
  }

  const customUserID = req.cookies.USERID
  let userResponses: number[] = []
  if (customUserID) {
    userResponses = map(
      prop('answer_id'),
      await getUserResponsesForPollSelector(poll, customUserID),
    )
  }

  return res.json({
    ...omit(
      ['passphrase', 'isProtected'],
      poll.get({ plain: true }),
    ),
    responsesCount: await poll.countResponses(),
    answers: await Promise.all(
      map(
        async (answer) => ({
          ...answer.get({ plain: true }),
          responsesCount: await answer.countResponses(),
        }),
        poll.answers,
      ),
    ),
    userResponses,
  })
}

export default getPoll
