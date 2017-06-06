import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {compose, equals, length } from 'ramda'
import EventBus from '../EventBus'
import { updateAnswer, removeAnswer } from '../../store/answers'

const KEY_UP_ARROW   = 38
const KEY_DOWN_ARROW = 40
const KEY_BACKSPACE  = 8
const KEY_DELETE     = 46

class Answer extends React.Component {
  handleChange = (event) => {
    this.props.onAnswerChange(this.props.index, event.target.value)
  }

  handleKeyPress = (event) => {
    event = event || window.event;
    const key = event.keyCode || event.charCode

    switch(key) {
      case KEY_UP_ARROW:
        this.eventBus.emit('focus', this.props.index -1)
        break
      case KEY_DOWN_ARROW:
        this.eventBus.emit('focus', this.props.index + 1)
        break
      case KEY_BACKSPACE:
      case KEY_DELETE:
        if (compose(equals(0), length)(this.props.text)) {
          event.preventDefault()
          this.props.onRemoveAnswer(this.props.index)
          this.eventBus.emit('focus', this.props.index -1)
        }
        break
    }
  }

  componentDidMount = () => {
    this.eventBus = EventBus.getEventBus()
    this.eventListener = this.eventBus.addListener('focus', (index) => {
      if (index === this.props.index) {
        this.refs.answer.focus()
      }
    })
  }

  componentWillUnmount = () => {
    this.eventListener.remove()
  }

  render = () => (
    <div className={'input input-answer'  + (this.props.disabled ? ' input-disabled' : '')}>
      <label
        className='input-label input-label-answer'
        htmlFor={'answer-' + this.props.index}>
          {this.props.index + 1}
      </label>
      <input
        className='input-field input-field-answer'
        type='text'
        id={'answer-' + this.props.index}
        name={'answer-' + this.props.index}
        ref='answer'
        value={this.props.text}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyPress}
        disabled={this.props.disabled} />
    </div>
  )
}

Answer.propTypes = {
  index    : PropTypes.number.isRequired,
  text     : PropTypes.string,
  disabled : PropTypes.bool,
}
Answer.defaultProps  = {
  text     : '',
  disabled : false,
}

const mapDispatchToProps = (dispatch) => ({
  onAnswerChange : (index, value) => {
    dispatch(updateAnswer(index, value))
  },
  onRemoveAnswer : (index) => {
    dispatch(removeAnswer(index))
  }
})

export default connect(null, mapDispatchToProps)(Answer)
