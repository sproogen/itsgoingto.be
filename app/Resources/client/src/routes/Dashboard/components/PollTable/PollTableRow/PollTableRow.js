import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { cond, propEq, always, T } from 'ramda'
import fontawesome from '@fortawesome/fontawesome'

class PollTableRow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      deleting : false
    }
  }

  goToPoll = (identifier) => () => {
    browserHistory.push('/' + identifier)
  }

  deletePoll = (identifier) => () => {
    const { deletePoll } = this.props

    this.setState({
      deleting : true
    })

    deletePoll(identifier)
  }

  getStatus = cond([
    [propEq('deleted', true), always('Deleted')],
    [propEq('ended', true),   always('Ended')],
    [T,                       always('Active')]
  ])

  render () {
    const { poll : { id, identifier, question, responsesCount, deleted, created }, poll } = this.props
    const { deleting } = this.state

    return (
      <tr>
        <td>{id}</td>
        <td><a onClick={this.goToPoll(identifier)}>{identifier}</a></td>
        <td>{question}</td>
        <td>{responsesCount}</td>
        <td>{this.getStatus(poll)}</td>
        <td>{created.date}</td>
        <td>
          {!deleted &&
            <span>
              {!deleting &&
                <a onClick={this.deletePoll(identifier)}>
                  <i className="fa fa-times"></i>
                </a>
              }
              {deleting && <i className="fa fa-circle-o-notch fa-spin"></i>}
            </span>
          }
        </td>
      </tr>
    )
  }
}

PollTableRow.propTypes = {
  poll       : PropTypes.object.isRequired,
  deletePoll : PropTypes.func.isRequired,
}

export default PollTableRow
