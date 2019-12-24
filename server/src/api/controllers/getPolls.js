import { includes, toUpper } from 'ramda'
import { Poll } from '../../db'

const availableSortFields = ['id', 'identifier', 'question', 'responsesCount', 'created']
const defaultPageSize = 20

// TODO: Allow only admin to get all polls
const getPolls = async (req, res) => {
  const pageSize = req.query.pageSize ? req.query.pageSize : defaultPageSize
  const page = req.query.page ? req.query.page - 1 : 0
  const sort = req.query.sort ? req.query.sort : 'id'
  const direction = req.query.sortDirection ? req.query.sortDirection : 'asc'

  if (!includes(sort, availableSortFields)) {
    return res.status(400).send({ error: 'invalid-sort-option' })
  }

  if (!includes(direction, ['asc', 'desc'])) {
    return res.status(400).send({ error: 'invalid-sort-direction' })
  }

  // TODO: Sort on response count
  const polls = await Poll.findAll({
    limit: pageSize,
    offset: page * pageSize,
    order: [
      [sort, toUpper(direction)]
    ]
  })

  // TODO: Return page count and total polls
  return res.json(polls)
}

export default getPolls
