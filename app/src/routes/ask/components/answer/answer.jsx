import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, equals, length, trim } from 'ramda'
import { updateAnswer, removeAnswer } from 'store/answers'
import EventBus from 'components/event-bus'
import './answer.scss'

const KEY_UP_ARROW   = 38
const KEY_DOWN_ARROW = 40
const KEY_BACKSPACE  = 8
const KEY_DELETE     = 46
const KEY_ENTER      = 13

class Answer extends React.Component {
  handleChange = (event) => {
    this.props.onAnswerChange(this.props.index, event.target.value)
  }

  handleKeyPress = (event) => {
    event = event || window.event
    const key = event.keyCode || event.charCode

    switch (key) {
      case KEY_UP_ARROW:
        this.eventBus.emit('focus', this.props.index - 1)
        break
      case KEY_DOWN_ARROW:
      case KEY_ENTER:
        this.eventBus.emit('focus', this.props.index + 1)
        break
      case KEY_BACKSPACE:
      case KEY_DELETE:
        if (compose(equals(0), length, trim)(this.props.text)) {
          event.preventDefault()
          this.props.onRemoveAnswer(this.props.index)
          this.eventBus.emit('focus', this.props.index - 1)
        }
        break
    }
  }

  componentDidMount = () => {
    this.eventBus = EventBus.getEventBus()
    this.eventListener = this.eventBus.addListener('focus', (index) => {
      if (index === this.props.index) {
        this._answer.focus()
      }
    })
  }

  componentWillUnmount = () => {
    this.eventListener.remove()
  }

  render () {
    const { index, text, disabled } = this.props

    return (
      <div className={'input input-answer' + (disabled ? ' input-disabled' : '')}>
        <label
          className='input-label input-label-answer'
          htmlFor={'answer-' + index} >
          {index + 1}
        </label>
        <input
          className='input-field input-field-answer'
          type='text'
          id={'answer-' + index}
          name={'answer-' + index}
          ref={(c) => { this._answer = c; }}
          value={text}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          disabled={disabled} />
      </div>
    )
  }
}

Answer.propTypes = {
  index          : PropTypes.number.isRequired,
  text           : PropTypes.string,
  disabled       : PropTypes.bool,
  onAnswerChange : PropTypes.func.isRequired,
  onRemoveAnswer : PropTypes.func.isRequired
}

Answer.defaultProps = {
  text     : '',
  disabled : false,
}

const mapDispatchToProps = (dispatch) => ({
  onAnswerChange : (index, value) => dispatch(updateAnswer(index, value)),
  onRemoveAnswer : (index) => dispatch(removeAnswer(index))
})

export default connect(null, mapDispatchToProps)(Answer)
