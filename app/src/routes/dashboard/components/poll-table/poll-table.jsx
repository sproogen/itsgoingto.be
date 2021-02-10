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

const PollTable = ({
  polls, pollCount, page, fetchPolls, setPollPage, deletePoll
}) => {
  const [loading, setLoading] = useState(pollCount === 0)
  const [sort, setSort] = useState('id')
  const [sortDirection, setSortDirection] = useState('desc')
  const hasPaginator = Math.ceil(pollCount / POLLS_PER_PAGE) > 1

  useEffect(() => {
    setLoading(true)
    if (fetchPollsPromise) {
      fetchPollsPromise.cancel()
    }
    fetchPollsPromise = new CancelablePromise(
      (resolve) => fetchPolls(page + 1, sort, sortDirection).then(resolve)
    )
    fetchPollsPromise.then(() => {
      setLoading(false)
    })

    return () => {
      if (fetchPollsPromise) {
        fetchPollsPromise.cancel()
      }
    }
  }, [page, sort, sortDirection])

  const changeSort = (newSort) => {
    setSort(newSort)
    setSortDirection(equals(sort, newSort) && equals('asc', sortDirection) ? 'desc' : 'asc')
  }

  return (
    <div className="panel">
      <div className="panel-header">
        Polls
      </div>
      <div className="panel-body">
        {loading
          && (
          <div className={`spinner-container center-text${!hasPaginator ? ' no-paginator' : ''}`}>
            <Spinner />
          </div>
          )}
        <div className={`table-container${loading ? ' hidden' : ''}`}>
          <table>
            <thead>
              <tr>
                <PollTableHeaderItem
                  label="ID"
                  style={{ width: '4em' }}
                  onSort={() => changeSort('id')}
                  sortDirection={equals('id', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label="Identifier"
                  style={{ width: '8em' }}
                  onSort={() => changeSort('identifier')}
                  sortDirection={equals('identifier', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label="Question"
                  onSort={() => changeSort('question')}
                  sortDirection={equals('question', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label="Responses"
                  style={{ width: '8em' }}
                  // onSort={() => changeSort('responsesCount')}
                  // sortDirection={equals('responsesCount', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label="Status"
                  style={{ width: '8em' }}
                />
                <PollTableHeaderItem
                  label="Created At"
                  style={{ width: '12em' }}
                  onSort={() => changeSort('created')}
                  sortDirection={equals('created', sort) && sortDirection}
                />
                <PollTableHeaderItem
                  label="Delete"
                  style={{ width: '4em' }}
                />
              </tr>
            </thead>
            <tbody>
              {
                polls.map((poll) => (
                  <PollTableRow key={poll.identifier} poll={poll} deletePoll={deletePoll} />
                ))
              }
            </tbody>
          </table>
        </div>
        <Paginator
          itemCount={pollCount}
          itemsPerPage={POLLS_PER_PAGE}
          page={page}
          pageCallback={setPollPage}
        />
      </div>
    </div>
  )
}

PollTable.propTypes = {
  polls: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      identifier: PropTypes.string,
      question: PropTypes.string,
      responsesCount: PropTypes.number,
      deleted: PropTypes.bool,
      ended: PropTypes.bool,
      created: PropTypes.string,
    })
  ).isRequired,
  pollCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  fetchPolls: PropTypes.func.isRequired,
  setPollPage: PropTypes.func.isRequired,
  deletePoll : PropTypes.func.isRequired,
}

export default PollTable
