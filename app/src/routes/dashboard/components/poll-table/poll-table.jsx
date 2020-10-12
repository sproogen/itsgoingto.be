import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import CancelablePromise from 'cancelable-promise'
import { POLLS_PER_PAGE } from 'store/poll/constants'
import Spinner from 'components/spinner'
import Paginator from 'components/paginator'
import PollTableRow from './poll-table-row'
import PollTableHeaderItem from './poll-table-header-item'
import './poll-table.scss'

let fetchPollsPromise

const PollTable = ({ polls, pollCount, page, fetchPolls, setPollPage, deletePoll }) => {
  // TODO : Store ID's of polls for the page in a dashboard store
  const [loading, setLoading] = useState(pollCount === 0)
  const [sort, setSort] = useState('id')
  const [sortDirection, setSortDirection] = useState('desc')
  const hasPaginator = Math.ceil(pollCount / POLLS_PER_PAGE) > 1

  const fetchPollsForPage = (newPage) => {
    setPollPage(newPage)
    fetchPollsPromise = new CancelablePromise(
      (resolve) => fetchPolls(newPage + 1, sort, sortDirection).then(resolve)
    )
    fetchPollsPromise.then(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchPollsForPage(page)

    return () => {
      fetchPollsPromise.cancel()
    }
  }, [page])

  const changePage = (newPage) => {
    fetchPollsPromise.cancel()
    setLoading(true)
    fetchPollsForPage(newPage)
  }

  const changeSort = (newSort) => {
    setSort(newSort)
    setSortDirection(equals(sort, newSort) && equals('asc', sortDirection) ? 'desc' : 'asc')
    setLoading(true)

    fetchPollsForPage(page)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        Polls
      </div>
      <div className='panel-body'>
        {loading &&
          <div className={'spinner-container center-text' + (!hasPaginator ? ' no-paginator' : '')}>
            <Spinner />
          </div>
        }
        <div className={'table-container' + (loading ? ' hidden' : '')}>
          <table>
            <thead>
              <tr>
                <PollTableHeaderItem
                  label='ID'
                  style={{ width: '4em' }}
                  onSort={() => changeSort('id')}
                  sortDirection={equals('id', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label='Identifier'
                  style={{ width: '8em' }}
                  onSort={() => changeSort('identifier')}
                  sortDirection={equals('identifier', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label='Question'
                  onSort={() => changeSort('question')}
                  sortDirection={equals('question', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label='Responses'
                  style={{ width: '8em' }}
                  onSort={() => changeSort('responsesCount')}
                  sortDirection={equals('responsesCount', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label='Status'
                  style={{ width: '8em' }} />
                <PollTableHeaderItem
                  label='Created At'
                  style={{ width: '12em' }}
                  onSort={() => changeSort('created')}
                  sortDirection={equals('created', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label='Delete'
                  style={{ width: '4em' }}
                />
              </tr>
            </thead>
            <tbody>
              {
                polls.map((poll) => (
                  <PollTableRow key={poll.id} poll={poll} deletePoll={deletePoll} />
                ))
              }
            </tbody>
          </table>
        </div>
        <Paginator
          itemCount={pollCount}
          itemsPerPage={POLLS_PER_PAGE}
          page={page}
          pageCallback={changePage}
        />
      </div>
    </div>
  )
}

PollTable.propTypes = {
  polls: PropTypes.array.isRequired, // TODO
  pollCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  fetchPolls: PropTypes.func.isRequired,
  setPollPage: PropTypes.func.isRequired,
  deletePoll : PropTypes.func.isRequired,
}

export default PollTable
