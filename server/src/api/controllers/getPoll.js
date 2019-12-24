import { isNil, dissoc } from 'ramda'
import { Poll } from '../../db'

const getPoll = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
      deleted: false // TODO: Allow admin to fetch deleted
    }
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'poll-not-found' })
  }

  // TODO: Allow admin to bypass passphrase
  if (
    !isNil(poll.passphrase)
    && poll.passphrase !== (req.query.passphrase ? req.query.passphrase : '')
  ) {
    return res.status(403).send({ error: 'incorrect-passphrase' })
  }

  // TODO: Get answers

  // TODO: Get responses for user

  return res.json(dissoc('passphrase', poll.get({ plain: true })))
}

export default getPoll
