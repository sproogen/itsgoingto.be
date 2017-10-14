import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { prop, compose, contains } from 'ramda'
import { fetchResponses } from 'store/api'
import Answer from '../Answer'
import './Answers.scss'

class Answers extends React.Component {
  updateAnswers = () => {
    this.props.updateResponses()
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
    compose(contains(answer.id), prop('userResponses'))(this.props.poll)

  render () {
    const { poll, answers, userResponded, totalResponses } = this.props

    return (
      <div className='container answer-container'>
        <div className={'options' + (userResponded ? ' show-results' : '')}>
          {answers.map((answer, index) =>
            <Answer
              key={index}
              index={index}
              type={poll.multipleChoice ? 'checkbox' : 'radio'}
              answer={answer}
              checked={this.answerChecked(answer)}
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
  updateResponses : PropTypes.func.isRequired
}

Answers.defaultProps = {
  totalResponses : 0
}

const mapDispatchToProps = (dispatch, props) => ({
  updateResponses : () => dispatch(fetchResponses(props.params.identifier))
})

export default withRouter(connect(null, mapDispatchToProps)(Answers))
