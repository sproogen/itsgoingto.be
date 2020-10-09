import {} from 'ramda'
import { Poll, Response } from '../../db'

// TODO: Swagger docs

const getStats = async (req, res) => {
  const totalPolls = await Poll.count()
  const totalResponses = await Response.count()

  return res.json({
    polls: totalPolls,
    responses: totalResponses
  })
}

export default getStats
