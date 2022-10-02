import { Request, Response } from 'express'
import { isNil, defaultTo } from 'ramda'
import { Poll, Answer } from '../../db'
import generatePollResponse from '../utils/generate-poll-response'

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

  return res.json(await generatePollResponse(poll, req.cookies.USERID))
}

export default getPoll
