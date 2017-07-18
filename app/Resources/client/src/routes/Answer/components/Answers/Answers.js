import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { answersSelector } from 'store/answers'
import { totalResponsesSelector, userRespondedSelector, pollSelector } from 'store/poll'
import { fetchResponses } from 'store/api'
import Answer from '../Answer/Answer'
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

  render = () => (
    <div className='container answer-container'>
      <div className={'options' + (this.props.userResponded ? ' show-results' : '')}>
        {this.props.answers.map((answer, index) =>
          <Answer
            key={index}
            index={index}
            type={this.props.poll.multipleChoice ? 'checkbox' : 'radio'}
            answer={answer}
            totalResponses={this.props.totalResponses} />
        )}
      </div>
    </div>
  )
}

Answers.propTypes = {
  answers         : PropTypes.array.isRequired,
  poll            : PropTypes.object.isRequired,
  totalResponses  : PropTypes.number.isRequired,
  userResponded   : PropTypes.bool.isRequired,
  updateResponses : PropTypes.func.isRequired
}

Answers.defaultProps = {
  totalResponses : 0
}

const mapStateToProps = (state, props) => ({
  answers        : answersSelector(state, props.params.identifier),
  poll           : pollSelector(state, props.params.identifier),
  totalResponses : totalResponsesSelector(state, props.params.identifier),
  userResponded  : userRespondedSelector(state, props.params.identifier)
})

const mapDispatchToProps = (dispatch, props) => ({
  updateResponses : () => dispatch(fetchResponses(props.params.identifier))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Answers))
