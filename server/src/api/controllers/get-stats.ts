import { Request, Response } from 'express'
import { Poll, Response as ResponseModel } from '../../db'

const getStats = async (_req: Request, res: Response): Promise<Response> => {
  const totalPolls = await Poll.count()
  const totalResponses = await ResponseModel.count()

  return res.json({
    polls: totalPolls,
    responses: totalResponses,
  })
}

export default getStats
