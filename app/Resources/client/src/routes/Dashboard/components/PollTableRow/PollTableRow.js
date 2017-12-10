import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

class PollTableRow extends React.Component {
  goToPoll = (identifier) => () => {
    browserHistory.push('/' + identifier)
  }

  render () {
    const { poll : { id, identifier, question, created } } = this.props

    return (
      <tr>
        <td>{id}</td>
        <td><a onClick={this.goToPoll(identifier)}>{identifier}</a></td>
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
