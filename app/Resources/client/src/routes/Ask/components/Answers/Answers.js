import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { length } from 'ramda'
import { hasQuestionSelector } from 'store/poll'
import { answersSelector } from 'store/answers'
import Answer from '../Answer/Answer'

export const Answers = ({ hasQuestion, answers }) => {
  return (
    <div className={'answers hideable' + (hasQuestion ? '' : ' gone')}>
      {answers.map((answer, index) =>
        <Answer key={index} index={index} text={answer.answer ? answer.answer : answer} />
      )}
      <Answer key={length(answers)} index={length(answers)} disabled />
    </div>
  )
}

Answers.propTypes = {
  hasQuestion : PropTypes.bool.isRequired,
  answers     : PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  hasQuestion : hasQuestionSelector(state),
  answers     : answersSelector(state)
})

export default connect(mapStateToProps)(Answers)
