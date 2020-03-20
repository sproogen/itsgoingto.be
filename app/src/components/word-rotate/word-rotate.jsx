import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  __, compose, nth, split, ifElse, add, subtract, equals, length
} from 'ramda'
import './word-rotate.scss'

const WordRotate = ({ words }) => {
  const [currentWord, setCurrentWord] = useState(0)
  const currentWordRef = useRef(0)
  const current = useRef(null)
  const previous = useRef(null)

  const updateWord = () => {
    console.log('currentWord', currentWordRef.current)
    currentWordRef.current = ifElse(
      equals(compose(subtract(__, 1), length, split(','))(words)),
      () => 0,
      add(1)
    )(currentWordRef.current)
    setCurrentWord(currentWordRef.current)
  }

  useEffect(() => {
    const wordUpdater = setInterval(
      updateWord,
      5000
    )
    return () => clearInterval(wordUpdater)
  }, [])

  useEffect(() => {
    if (current.current && typeof current.current.animate === 'function') {
      current.current.animate([
        { transform: 'translate(0, -0.8em)', opacity: 0 },
        { transform: 'translate(0)', opacity: 1 }
      ], 500, 'easeInOutQuart')
    }
    if (previous.current && typeof previous.current.animate === 'function') {
      previous.current.animate([
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
        ref={current}
      >
        { getWord(currentWord) }
      </span>
      <span
        className="word-rotate_word word-rotate_word--previous"
        ref={previous}
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
