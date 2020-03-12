import React from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import classNames from 'classnames'
import Answer from './answer'
import './answers.scss'

const Answers = ({
  hasQuestion, answers, onAnswerChange, onRemoveAnswer
}) => (
  <div
    className={classNames(
      'answers hideable',
      {
        gone: !hasQuestion
      }
    )}
  >
    <label // eslint-disable-line jsx-a11y/label-has-associated-control
      className="input-label input-label-answers"
    >
      Add some responses
    </label>
    {
      answers.map((answer, index) => (
        <Answer
          key={index} // eslint-disable-line react/no-array-index-key
          index={index}
          text={answer.answer ? answer.answer : answer}
          onAnswerChange={onAnswerChange}
          onRemoveAnswer={onRemoveAnswer}
        />
      ))
    }
    <Answer key={length(answers)} index={length(answers)} disabled />
  </div>
)

Answers.propTypes = {
  hasQuestion: PropTypes.bool.isRequired,
  answers: PropTypes.oneOf([
    PropTypes.arrayOf({
      id: PropTypes.number,
      answer: PropTypes.string
    }),
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onRemoveAnswer: PropTypes.func.isRequired
}

export default Answers
