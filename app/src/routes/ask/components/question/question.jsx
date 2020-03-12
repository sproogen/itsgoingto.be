import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  compose, nth, slice, concat, __, when, ifElse, add, equals, subtract, length
} from 'ramda'
import autosize from 'autosize'
import EventBus from 'services/event-bus'
import './question.scss'

const KEY_DOWN_ARROW = 40
const KEY_ENTER = 13
const PLACEHOLDER_TEXT = [
  'What film should we watch?',
  'Who is going to win the league?',
  'Where should we go for drinks?',
  'You talking to me?',
  'What should we do this weekend?',
  'When should we go to Paris?',
  'Who ya gonna call?',
  'When will you start a poll?'
]

const Question = ({ question, onQuestionChange }) => {
  const [placeholder, setPlaceholder] = useState(0)
  const [character, setCharacter] = useState(0)
  const [cursor, setCursor] = useState(false)
  const [cursorUpdater, setCursorUpdater] = useState(false)
  const [characterUpdater, setCharacterUpdater] = useState(false)
  const textarea = useRef(null)

  const eventBus = EventBus.getEventBus()

  const handleChange = (event) => onQuestionChange(event.target.value)

  const handleKeyPress = (event) => {
    // event = event || window.event
    const key = event.keyCode || event.charCode

    switch (key) {
      case KEY_DOWN_ARROW:
      case KEY_ENTER:
        event.preventDefault()
        eventBus.emit('focus', 0)
        break
      default:
        break
    }
  }

  const humanize = () => Math.round(Math.random() * (150 - 30)) + 30

  const toggleCursor = () => setCursor(!cursor)

  const type = () => {
    setCharacter(character + 1)
    setCharacterUpdater(setTimeout(
      type,
      humanize()
    ))
    if (character <= PLACEHOLDER_TEXT[placeholder].length) {
      clearInterval(cursorUpdater)
      setCursor(true)
      setCursorUpdater(setInterval(
        toggleCursor,
        500
      ))
    }
  }

  const updatePlaceholder = () => {
    setCharacter(0)
    setPlaceholder(
      ifElse(
        equals(compose(subtract(__, 1), length)(PLACEHOLDER_TEXT)),
        () => 0,
        add(1)
      )(placeholder)
    )
  }

  const placeholderSelector = () => compose(
    when(
      () => cursor,
      concat(__, '|')
    ),
    slice(0, character),
    nth(placeholder)
  )(PLACEHOLDER_TEXT)

  useEffect(() => {
    const eventListener = EventBus.getEventBus().addListener('focus', (index) => {
      if (index === -1) {
        textarea.current.focus()
      }
    })
    autosize(textarea.current)
    setCursorUpdater(setInterval(
      toggleCursor,
      500
    ))
    setCharacterUpdater(setTimeout(
      type,
      humanize()
    ))
    const placeholderUpdater = setInterval(
      updatePlaceholder,
      5000
    )

    return () => {
      eventListener.remove()
      autosize.destroy(textarea.current)
      clearInterval(cursorUpdater)
      clearTimeout(characterUpdater)
      clearInterval(placeholderUpdater)
    }
  }, [])


  return (
    <div className="input input-question">
      <label className="input-label input-label-question" htmlFor="question">
        Ask a question
        <textarea
          className="input-field input-field-question js-auto-size"
          value={question}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholderSelector()}
          rows="1"
          id="question"
          name="question"
          ref={textarea}
        />
      </label>
    </div>
  )
}

Question.propTypes = {
  question: PropTypes.string.isRequired,
  onQuestionChange: PropTypes.func.isRequired
}

export default Question
