import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import {
  cond, propEq, always, T
} from 'ramda'
import moment from 'moment'

const PollTableRow = ({ poll, deletePoll }) => {
  const {
    id, identifier, question, responsesCount, deleted, created
  } = poll
  const history = useHistory()
  const [deleting, setDeleting] = useState(false)

  const goToPoll = () => {
    history.push(`/${identifier}`)
  }

  const onDeletePoll = () => {
    setDeleting(true)

    deletePoll(identifier)
  }

  const status = cond([
    [propEq('deleted', true), always('Deleted')],
    [propEq('ended', true), always('Ended')],
    [T, always('Active')]
  ])(poll)

  return (
    <tr>
      <td>{id}</td>
      <td><button onClick={goToPoll} type="button">{identifier}</button></td>
      <td>{question}</td>
      <td>{responsesCount}</td>
      <td data-testid={`status-${id}`}>{status}</td>
      <td>{moment.utc(created).local().format('DD-MM-YYYY HH:mm')}</td>
      <td>
        {!deleted
          && (
          <span>
            {!deleting
              && (
              <button data-testid={`delete-${id}`} onClick={onDeletePoll} type="button">
                <i className="fa fa-times" />
              </button>
              )}
            {deleting && <i data-testid={`delete-${id}-spinner`} className="fa fa-circle-o-notch fa-spin" />}
          </span>
          )}
      </td>
    </tr>
  )
}

PollTableRow.propTypes = {
  poll: PropTypes.shape({
    id: PropTypes.number,
    identifier: PropTypes.string,
    question: PropTypes.string,
    responsesCount: PropTypes.number,
    deleted: PropTypes.bool,
    ended: PropTypes.bool,
    created: PropTypes.string,
  }).isRequired,
  deletePoll : PropTypes.func.isRequired,
}

export default PollTableRow
