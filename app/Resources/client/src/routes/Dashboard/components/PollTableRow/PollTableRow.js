import React from 'react'
import PropTypes from 'prop-types'

class PollTableRow extends React.Component {
  render () {
    const { poll : { id, identifier, question, created } } = this.props

    return (
      <tr>
        <td>{id}</td>
        <td>{identifier}</td>
        <td>{question}</td>
        <td>{created.date}</td>
        <td>X</td>
      </tr>
    )
  }
}

PollTableRow.propTypes = {
  poll : PropTypes.object.isRequired,
}

export default PollTableRow
