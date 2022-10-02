import { Request, Response } from 'express'
import { includes, toUpper, map } from 'ramda'
import { Poll } from '../../db'
import generatePollResponse from '../utils/generate-poll-response'

interface Query {
  pageSize?: string
  page?: number
  sort?: string
  sortDirection?: string
}

// TODO: Sort on response count
// TODO: Validation on pageSize & page not numerical

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_PAGE = 0
const DEFAULT_SORT = 'id'
const DEFAULT_SORT_DIRECTION = 'asc'

const getPolls = async (req: Request<never, never, never, Query>, res: Response): Promise<Response> => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : DEFAULT_PAGE_SIZE
  const page = req.query.page ? req.query.page - 1 : DEFAULT_PAGE
  const sort = req.query.sort ? req.query.sort : DEFAULT_SORT
  const direction = req.query.sortDirection ? req.query.sortDirection : DEFAULT_SORT_DIRECTION

  if (!includes(sort, ['id', 'identifier', 'question', 'created'])) {
    return res.status(400).send({ error: 'invalid-sort-option' })
  }

  if (!includes(direction, ['asc', 'desc'])) {
    return res.status(400).send({ error: 'invalid-sort-direction' })
  }

  const polls = await Poll.findAndCountAll({
    limit: pageSize,
    offset: page * pageSize,
    order: [
      [sort, toUpper(direction)],
    ],
  })

  return res.json({
    count: polls.rows.length,
    total: polls.count,
    entities: await Promise.all(
      map(
        async (poll) => generatePollResponse(poll, false, false),
        polls.rows,
      ),
    ),
  })
}

export default getPolls
