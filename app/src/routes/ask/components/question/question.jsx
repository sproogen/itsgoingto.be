import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, nth, slice, concat, __, when, merge, ifElse, add, equals, subtract, length } from 'ramda'
import autosize from 'autosize'
import { updateQuestion } from 'store/poll'
import EventBus from 'components/event-bus'
import './question.scss'

const KEY_DOWN_ARROW = 40
const KEY_ENTER = 13

class Question extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      placeholder : 0,
      character : 0,
      cursor : false,
    }
  }

  handleChange = (event) => {
    const { onQuestionChange } = this.props

    onQuestionChange(event.target.value)
  }

  handleKeyPress = (event) => {
    event = event || window.event
    const key = event.keyCode || event.charCode

    switch (key) {
      case KEY_DOWN_ARROW:
      case KEY_ENTER:
        event.preventDefault()
        this.eventBus.emit('focus', 0)
        break
    }
  }

  humanize = () => Math.round(Math.random() * (150 - 30)) + 30

  toggleCursor = () => {
    this.setState((prevState) =>
      merge(prevState, { cursor : !prevState.cursor })
    )
  }

  type = () => {
    this.setState((prevState) =>
      merge(prevState, { character : prevState.character + 1 })
    )
    this.characterUpdate = setTimeout(
      this.type,
      this.humanize()
    )
    if (this.state.character <= this.props.placeholderText[this.state.placeholder].length) {
      clearInterval(this.cursorUpdater)
      this.setState(merge(this.state, { cursor : true }))
      this.cursorUpdater = setInterval(
        this.toggleCursor,
        500
      )
    }
  }

  updatePlaceholder = () => {
    this.setState((prevState, props) =>
      merge(prevState, {
        character   : 0,
        placeholder : ifElse(
          equals(compose(subtract(__, 1), length)(props.placeholderText)),
          () => 0,
          add(1)
        )(prevState.placeholder)
      })
    )
  }

  placeholderSelector = (state) =>
    compose(
      when(
        () => state.cursor,
        concat(__, '|')
      ),
      slice(0, state.character),
      nth(state.placeholder)
    )(this.props.placeholderText)

  componentDidMount = () => {
    this.eventBus = EventBus.getEventBus()
    this.eventListener = this.eventBus.addListener('focus', (index) => {
      if (index === -1) {
        this.refs.question.focus()
      }
    })
    autosize(this.refs.question)
    this.cursorUpdater = setInterval(
      this.toggleCursor,
      500
    )
    this.characterUpdate = setTimeout(
      this.type,
      this.humanize()
    )
    this.placeholderUpdater = setInterval(
      this.updatePlaceholder,
      5000
    )
  }

  componentWillUnmount = () => {
    this.eventListener.remove()
    autosize.destroy(this.refs.question)
    clearInterval(this.cursorUpdater)
    clearTimeout(this.characterUpdate)
    clearInterval(this.placeholderUpdater)
  }

  render () {
    const { question } = this.props

    return (
      <div className='input input-question'>
        <label className='input-label input-label-question' htmlFor='question'>Ask a question</label>
        <textarea
          className='input-field input-field-question js-auto-size'
          value={question}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          placeholder={this.placeholderSelector(this.state)}
          rows='1'
          id='question'
          name='question'
          ref='question' />
      </div>
    )
  }
}

Question.propTypes = {
  placeholderText  : PropTypes.array.isRequired,
  question         : PropTypes.string.isRequired,
  onQuestionChange : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  onQuestionChange : (value) => dispatch(updateQuestion(value))
})

export default connect(null, mapDispatchToProps)(Question)
