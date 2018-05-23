import React from 'react'
import PropTypes from 'prop-types'
import { __, compose, nth, split, ifElse, add, subtract, equals, length } from 'ramda'
import './word-rotate.scss'

class WordRotate extends React.Component {
  constructor (props) {
    super(props)
    this.state = { currentWord : 0 }
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

  componentDidMount = () => {
    this.wordUpdater = setInterval(
      this.updateWord,
      5000
    )
  }

  componentWillUpdate = () => {
    if (this.refs.current) {
      this.refs.current.animate([
        { transform : 'translate(0, -0.8em)', opacity : 0 },
        { transform : 'translate(0)', opacity : 1 }
      ], 500, 'easeInOutQuart')
    }
    if (this.refs.previous) {
      this.refs.previous.animate([
        { transform : 'translate(0)', opacity: 1 },
        { transform : 'translate(0, 0.6em)', opacity : 0 }
      ], 350, 'easeInOutQuart')
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.wordUpdater)
  }

  render () {
    const { currentWord } = this.state

    return (
      <span className='word-rotate'>
        <span className='word-rotate_word' ref='current'>
          { this.getWord(currentWord) }
        </span>
        <span className='word-rotate_word word-rotate_word--previous' ref='previous'>
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