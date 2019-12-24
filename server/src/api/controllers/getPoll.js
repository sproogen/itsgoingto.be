import { isNil } from 'ramda'
import { Poll } from '../../db'

const getPoll = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      identifier: req.params.identifier,
      deleted: false // TODO: Allow admin to fetch deleted
    }
  })

  if (isNil(poll)) {
    return res.status(404).send({ error: 'Poll not found.' })
  }

  // TODO: Check passphrase & admin to skip passphrase

  // TODO: Check and update poll ended

  // TODO: Get answers

  // TODO: Get responses for user

  // TODO: Filter poll data

  return res.json(poll)
}

export default getPoll
