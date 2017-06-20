import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { answersSelector } from 'store/answers'
import { totalResponsesSelector, userRespondedSelector } from 'store/poll'
import Answer from '../Answer/Answer'
import './Answers.scss'

class Answers extends React.Component {
  render = () => (
    <div className='container answer-container'>
      <div className={'options' + (this.props.userResponded ? ' show-results' : '')}>
        {this.props.answers.map((answer, index) =>
          <Answer key={index} index={index} answer={answer} totalResponses={this.props.totalResponses} />
        )}
      </div>
    </div>
  )
}

Answers.propTypes = {
  answers        : PropTypes.array.isRequired,
  totalResponses : PropTypes.number.isRequired,
}

Answers.defaultProps = {
  totalResponses : 0
}

const mapStateToProps = (state, props) => ({
  answers        : answersSelector(state, props.params.identifier),
  totalResponses : totalResponsesSelector(state, props.params.identifier),
  userResponded  : userRespondedSelector(state, props.params.identifier)
})

export default withRouter(connect(mapStateToProps)(Answers))
