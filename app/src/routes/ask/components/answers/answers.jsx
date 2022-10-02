import React from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import classNames from 'classnames'
import Answer from './answer'
import './answers.scss'

const Answers = ({
  answers, onAnswerChange, onRemoveAnswer,
}) => (
  <div
    data-testid="answers"
    className="answers"
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
    <div className={classNames('input input-answer input-disabled')}>
      <label
        className="input-label input-label-answer"
        htmlFor={`answer-${length(answers)}`}
      >
        {length(answers) + 1}
      </label>
      <input
        className="input-field input-field-answer"
        type="text"
        id={`answer-${length(answers)}`}
        name={`answer-${length(answers)}`}
        disabled
      />
    </div>
  </div>
)

Answers.propTypes = {
  answers: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        answer: PropTypes.string,
      }),
    ),
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onRemoveAnswer: PropTypes.func.isRequired,
}

export default Answers
