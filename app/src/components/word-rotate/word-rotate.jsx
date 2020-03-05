import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  __, compose, nth, split, ifElse, add, subtract, equals, length
} from 'ramda'
import './word-rotate.scss'

const WordRotate = ({ words }) => {
  const [currentWord, setCurrentWord] = useState(0)

  const updateWord = () => {
    setCurrentWord(
      ifElse(
        equals(compose(subtract(__, 1), length, split(','))(words)),
        () => 0,
        add(1)
      )(currentWord)
    )
  }

  useEffect(() => {
    this.wordUpdater = setInterval( // eslint-disable-line
      updateWord,
      5000
    )
  },
  () => {
    clearInterval(this.wordUpdater) // eslint-disable-line
  }, [])

  useEffect(() => {
    if (this._current) { // eslint-disable-line
      this._current.animate([ // eslint-disable-line
        { transform: 'translate(0, -0.8em)', opacity: 0 },
        { transform: 'translate(0)', opacity: 1 }
      ], 500, 'easeInOutQuart')
    }
    if (this._previous) { // eslint-disable-line
      this._previous.animate([ // eslint-disable-line
        { transform: 'translate(0)', opacity: 1 },
        { transform: 'translate(0, 0.6em)', opacity: 0 }
      ], 350, 'easeInOutQuart')
    }
  }, [currentWord])

  const getWord = (index) => compose(nth(index), split(','))(words)

  return (
    <span className="word-rotate">
      <span
        className="word-rotate_word"
        ref={(c) => { this._current = c }} // eslint-disable-line
      >
        { getWord(currentWord) }
      </span>
      <span
        className="word-rotate_word word-rotate_word--previous"
        ref={(c) => { this._previous = c }} // eslint-disable-line
      >
        { getWord(subtract(currentWord, 1)) }
      </span>
    </span>
  )
}

WordRotate.propTypes = {
  words: PropTypes.string.isRequired
}

export default WordRotate
