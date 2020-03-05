import React from 'react'
import PropTypes from 'prop-types'
import {
  prop, compose, contains, when, isNil
} from 'ramda'
import Spinner from 'components/spinner'
import Answer from '../answer'
import './answers.scss'

const Answers = ({
  poll, answers, userResponded, onResponseSelected, totalResponses, viewOnly
}) => {
  const answerChecked = (answer) => compose(contains(answer.id), when(isNil, () => []), prop('userResponses'))(poll)

  return (
    <div className="container answer-container">
      {answers.length === 0 && (
        <div className="spinner-container center-text">
          <Spinner />
        </div>
      )}
      <div className={`options${(userResponded || viewOnly || poll.ended ? ' show-results' : '')}`}>
        {answers.map((answer, index) => (
          <Answer
            key={index}
            index={index}
            type={poll.multipleChoice ? 'checkbox' : 'radio'}
            answer={answer}
            poll={poll}
            viewOnly={viewOnly}
            checked={answerChecked(answer)}
            onResponseSelected={onResponseSelected}
            totalResponses={totalResponses}
          />
        ))}
      </div>
    </div>
  )
}

Answers.propTypes = {
  answers: PropTypes.array.isRequired,
  poll: PropTypes.object.isRequired,
  totalResponses: PropTypes.number,
  userResponded: PropTypes.bool.isRequired,
  viewOnly: PropTypes.bool.isRequired,
  onResponseSelected: PropTypes.func.isRequired,
}

Answers.defaultProps = {
  totalResponses: 0
}

export default Answers
