import React from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import Answer from '../answer'

export function Answers ({ hasQuestion, answers }) {
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

export default Answers
