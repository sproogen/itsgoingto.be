import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Linkify from 'react-linkify'
import './answer.scss'

const Answer = ({
  index, type, checked, answer, poll, viewOnly, totalResponses, onResponseSelected
}) => {
  const [animating, setAnimating] = useState(false)
  const linkClicked = useRef(false)

  const handleClick = () => {
    if (!linkClicked.current) {
      if (!poll.ended && !viewOnly) {
        setAnimating(true)
        setTimeout(() => {
          setAnimating(false)
        }, 550)

        onResponseSelected(answer.id)
      }
    } else {
      linkClicked.current = false
    }
  }

  const linkClick = () => {
    linkClicked.current = true
  }

  const calculateWidth = () => ({
    width: `${(answer.responsesCount / totalResponses) * 100}%`
  })

  return (
    <span className="input input-options">
      <span className="result-wrapper">
        <span className="result" name={`answer-${index}`} style={calculateWidth()} />
      </span>
      <input
        id={`answer-${index}`}
        name="answer"
        className={classNames({
          'input-radio input-radio-options': type === 'radio',
          'input-checkbox input-checkbox-options': type !== 'radio'
        })}
        type={type}
        value={index}
        checked={checked}
        readOnly
      />
      <label // eslint-disable-line
        htmlFor={`answer-${index}`}
        className={classNames(
          'input-label input-label-options',
          {
            'input-label-options--click': animating,
            'input-label-options--hidden': poll.ended || viewOnly
          }
        )}
        onClick={handleClick}
      >
        <Linkify properties={{ target: '_blank', onClick: linkClick }}>{ answer.answer }</Linkify>
      </label>
      <span htmlFor={`answer-${index}`} className="input-label-votes">
        {`${answer.responsesCount} votes`}
      </span>
    </span>
  )
}

Answer.propTypes = {
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  answer: PropTypes.shape({
    id: PropTypes.number,
    answer: PropTypes.string,
    responsesCount: PropTypes.number
  }).isRequired,
  poll: PropTypes.shape({
    ended: PropTypes.bool
  }).isRequired,
  totalResponses: PropTypes.number.isRequired,
  checked: PropTypes.bool.isRequired,
  viewOnly: PropTypes.bool.isRequired,
  onResponseSelected: PropTypes.func.isRequired
}

export default Answer
