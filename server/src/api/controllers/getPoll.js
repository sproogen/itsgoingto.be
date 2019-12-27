import { isNil, defaultTo } from 'ramda'
import { Poll } from '../../db'

const getPoll = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
      deleted: false // TODO: Allow admin to fetch deleted
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

  // TODO: Get responses for user

  return res.json(poll)
}

export default getPoll
