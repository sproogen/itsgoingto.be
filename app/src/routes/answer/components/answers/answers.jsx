import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { prop, compose, contains, when, isNil } from 'ramda'
import { fetchResponses, postResponse, fetchPoll, APIError } from 'store/api'
import Spinner from 'components/spinner'
import Answer from '../answer'
import './answers.scss'

class Answers extends React.Component {
  updateAnswers = () => {
    const { poll, updateResponses, fetchPoll } = this.props

    if (poll.ended || poll.deleted) {
      clearInterval(this.answersUpdater)
    } else {
      updateResponses()
        .then((response) => {
          if (response instanceof APIError) {
            fetchPoll()
          }
        })
    }
  }

  componentDidMount = () => {
    this.answersUpdater = setInterval(
      this.updateAnswers,
      5000
    )
  }

  componentWillUnmount = () => {
    clearInterval(this.answersUpdater)
  }

  answerChecked = (answer) =>
    compose(contains(answer.id), when(isNil, () => []), prop('userResponses'))(this.props.poll)

  render () {
    const { poll, answers, userResponded, postResponse, totalResponses, viewOnly } = this.props

    return (
      <div className='container answer-container'>
        {answers.length === 0 &&
          <div className={'spinner-container center-text'}>
            <Spinner />
          </div>
        }
        <div className={'options' + (userResponded || viewOnly || poll.ended ? ' show-results' : '')}>
          {answers.map((answer, index) =>
            <Answer
              key={index}
              index={index}
              type={poll.multipleChoice ? 'checkbox' : 'radio'}
              answer={answer}
              poll={poll}
              viewOnly={viewOnly}
              checked={this.answerChecked(answer)}
              postResponse={postResponse}
              totalResponses={totalResponses} />
          )}
        </div>
      </div>
    )
  }
}

Answers.propTypes = {
  answers         : PropTypes.array.isRequired,
  poll            : PropTypes.object.isRequired,
  totalResponses  : PropTypes.number,
  userResponded   : PropTypes.bool.isRequired,
  viewOnly        : PropTypes.bool.isRequired,
  updateResponses : PropTypes.func.isRequired,
  postResponse    : PropTypes.func.isRequired,
  fetchPoll       : PropTypes.func.isRequired
}

Answers.defaultProps = {
  totalResponses : 0
}

const mapDispatchToProps = (dispatch, props) => ({
  updateResponses : () => dispatch(fetchResponses(props.params.identifier)),
  postResponse    : (id) => dispatch(postResponse(id, props.params.identifier)),
  fetchPoll       : () => dispatch(fetchPoll(props.params.identifier))
})

export default withRouter(connect(null, mapDispatchToProps)(Answers))
