import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { length } from 'ramda'
import { hasQuestionSelector } from '../../store/question'
import { answersSelector } from '../../store/answers'
import './Answers.scss'

export const Answer = ({ index, text, disabled }) => {
  return (
    <div className={'input input-answer'  + (disabled ? ' input-disabled' : '')}>
      <label
        className='input-label input-label-answer'
        htmlFor={'answer-'+index}>
          {index+1}
      </label>
      <input
        className='input-field input-field-answer'
        type='text'
        id={'answer-'+index}
        name={'answer-'+index}
        value={text}
        disabled={disabled} />
    </div>
  )
}

Answer.propTypes = {
  index    : PropTypes.number.isRequired,
  text     : PropTypes.string,
  disabled : PropTypes.bool,
}
Answer.defaultProps  = {
  text     : '',
  disabled : false,
}

export const Answers = ({ hasQuestion, answers }) => {
  return (
    <div className={'answers hideable' + (hasQuestion ? '' : ' gone')}>
      {answers.map((answer, index) =>
        <Answer key={index} index={index} text={answer} />
      )}
      <Answer key={length(answers)} index={length(answers)} disabled={true} />
    </div>
  )
}

Answers.propTypes = {
  hasQuestion: PropTypes.bool.isRequired,
  answers: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => {
  return{
    hasQuestion : hasQuestionSelector(state),
    answers     : answersSelector(state)
  }
}

export default connect(mapStateToProps)(Answers)
