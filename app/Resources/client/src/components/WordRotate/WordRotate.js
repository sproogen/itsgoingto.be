import React from 'react'
import PropTypes from 'prop-types'
import {compose, nth, split} from 'ramda';

export const WordRotate = ({ words }) => {
  const getWord = (index) => compose(nth(index), split(','))(words)
  let currentWord = 0

  return (
    <span className='word-rotate'>
      { getWord(currentWord) }
    </span>
  )
}
WordRotate.propTypes = {
  words: PropTypes.string.isRequired
}

export default WordRotate
