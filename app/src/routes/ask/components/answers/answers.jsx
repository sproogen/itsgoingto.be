import React from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import Answer from './answer'
import './answers.scss'

export const Answers = ({ hasQuestion, answers }) => (
  <div className={'answers hideable' + (hasQuestion ? '' : ' gone')}>
    <label className='input-label input-label-answers'>Add some responses</label>
    {answers.map((answer, index) =>
      <Answer key={index} index={index} text={answer.answer ? answer.answer : answer} />
    )}
    <Answer key={length(answers)} index={length(answers)} disabled />
  </div>
)

Answers.propTypes = {
  hasQuestion : PropTypes.bool.isRequired,
  answers     : PropTypes.array.isRequired
}

export default Answers
