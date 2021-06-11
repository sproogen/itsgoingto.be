import { Request, Response } from 'express'
import { isNil, omit } from 'ramda'
import { Poll } from '../../db'

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

  return res.json({
    ...omit(
      ['passphrase', 'isProtected'],
      poll.get({ plain: true }),
    ),
    responsesCount: await poll.countResponses(),
  })
}

export default deletePoll
