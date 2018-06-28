import React from 'react'
import PropTypes from 'prop-types'
import { __, compose, nth, split, ifElse, add, subtract, equals, length } from 'ramda'
import './word-rotate.scss'

class WordRotate extends React.Component {
  constructor (props) {
    super(props)
    this.state = { currentWord : 0 }
  }

  componentDidMount = () => {
    this.wordUpdater = setInterval(
      this.updateWord,
      5000
    )
  }

  componentDidUpdate = () => {
    if (this._current) {
      this._current.animate([
        { transform: 'translate(0, -0.8em)', opacity: 0 },
        { transform: 'translate(0)', opacity: 1 }
      ], 500, 'easeInOutQuart')
    }
    if (this._previous) {
      this._previous.animate([
        { transform: 'translate(0)', opacity: 1 },
        { transform: 'translate(0, 0.6em)', opacity: 0 }
      ], 350, 'easeInOutQuart')
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.wordUpdater)
  }

  getWord = (index) => compose(nth(index), split(','))(this.props.words)

  updateWord = () => {
    this.setState((prevState, props) => ({
      currentWord : ifElse(
        equals(compose(subtract(__, 1), length, split(','))(props.words)),
        () => 0,
        add(1)
      )(prevState.currentWord)
    }))
  }

  render () {
    const { currentWord } = this.state

    return (
      <span className='word-rotate'>
        <span className='word-rotate_word' ref={(c) => { this._current = c }}>
          { this.getWord(currentWord) }
        </span>
        <span className='word-rotate_word word-rotate_word--previous' ref={(c) => { this._previous = c }}>
          { this.getWord(subtract(currentWord, 1)) }
        </span>
      </span>
    )
  }
}

WordRotate.propTypes = {
  words: PropTypes.string.isRequired
}

export default WordRotate
