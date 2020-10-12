import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { cond, propEq, always, T } from 'ramda'
import moment from 'moment'

const PollTableRow = ({ poll: { id, identifier, question, responsesCount, deleted, created }, poll, deletePoll }) => {
  const history = useHistory()
  const [deleting, setDeleting] = useState(false)

  const goToPoll = (identifier) => () => {
    history.push('/' + identifier)
  }

  const onDeletePoll = (identifier) => () => {
    setDeleting(true)

    deletePoll(identifier)
  }

  const getStatus = cond([
    [propEq('deleted', true), always('Deleted')],
    [propEq('ended', true), always('Ended')],
    [T, always('Active')]
  ])

  return (
    <tr>
      <td>{id}</td>
      <td><a id={`identifier-${id}`} onClick={goToPoll(identifier)}>{identifier}</a></td>
      <td>{question}</td>
      <td>{responsesCount}</td>
      <td>{getStatus(poll)}</td>
      <td>{moment.utc(created.date).local().format('DD-MM-YYYY HH:mm')}</td>
      <td>
        {!deleted &&
          <span>
            {!deleting &&
              <a id={`delete-${id}`} onClick={onDeletePoll(identifier)}>
                <i className='fa fa-times' />
              </a>
            }
            {deleting && <i className='fa fa-circle-o-notch fa-spin' />}
          </span>
        }
      </td>
    </tr>
  )
}

PollTableRow.propTypes = {
  poll: PropTypes.object.isRequired, // TODO
  deletePoll : PropTypes.func.isRequired,
}

export default PollTableRow
