import { Request, Response } from 'express'
import { isNil } from 'ramda'
import { Poll } from '../../db'
import generatePollResponse from '../utils/generate-poll-response'

type Params = {
  identifier: string
}

const deletePoll = async (req: Request<Params, never, never, never>, res: Response): Promise<Response> => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
    },
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'poll-not-found' })
  }

  if (poll.deleted === true) {
    return res.status(400).send({ error: 'poll-already-deleted' })
  }

  await poll.update({ deleted: true })

  return res.json(await generatePollResponse(poll, false, false))
}

export default deletePoll
