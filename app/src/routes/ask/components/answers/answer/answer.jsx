import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  compose, equals, length, trim
} from 'ramda'
import classNames from 'classnames'
import EventBus from 'services/event-bus'
import './answer.scss'

const KEY_UP_ARROW = 38
const KEY_DOWN_ARROW = 40
const KEY_BACKSPACE = 8
const KEY_DELETE = 46
const KEY_ENTER = 13

const Answer = ({
  index, text, disabled, onAnswerChange, onRemoveAnswer
}) => {
  const answer = useRef(null)
  const eventBus = EventBus.getEventBus()

  const handleChange = (event) => onAnswerChange(index, event.target.value)

  const handleKeyPress = (event) => {
    // event = event || window.event
    const key = event.keyCode || event.charCode

    switch (key) {
      case KEY_UP_ARROW:
        eventBus.emit('focus', index - 1)
        break
      case KEY_DOWN_ARROW:
      case KEY_ENTER:
        eventBus.emit('focus', index + 1)
        break
      case KEY_BACKSPACE:
      case KEY_DELETE:
        if (compose(equals(0), length, trim)(text)) {
          event.preventDefault()
          onRemoveAnswer(index)
          eventBus.emit('focus', index - 1)
        }
        break
      default:
    }
  }

  useEffect(() => {
    const eventListener = eventBus.addListener('focus', (i) => {
      if (i === index) {
        answer.current.focus()
      }
    })

    return () => eventListener.remove()
  }, [])

  return (
    <div
      className={classNames(
        'input input-answer',
        {
          'input-disabled': disabled
        }
      )}
    >
      <label
        className="input-label input-label-answer"
        htmlFor={`answer-${index}`}
      >
        {index + 1}
      </label>
      <input
        className="input-field input-field-answer"
        type="text"
        id={`answer-${index}`}
        name={`answer-${index}`}
        ref={answer}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        disabled={disabled}
      />
    </div>
  )
}

Answer.propTypes = {
  index: PropTypes.number.isRequired,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onAnswerChange: PropTypes.func.isRequired,
  onRemoveAnswer: PropTypes.func.isRequired
}

Answer.defaultProps = {
  text: '',
  disabled: false,
}

export default Answer
