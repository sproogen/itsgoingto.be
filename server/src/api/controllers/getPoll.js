import { isNil, defaultTo } from 'ramda'
import { Poll } from '../../db'

// TODO: Allow admin to return deleted
// TODO: Allow admin to bypass passphrase

const getPoll = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
    }
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

  return res.json(poll)
}

export default getPoll
