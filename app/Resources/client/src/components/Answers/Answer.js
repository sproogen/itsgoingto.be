import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {compose, equals, length } from 'ramda'
import { updateAnswer, removeAnswer } from '../../store/answers'

export const Answer = ({ index, text, disabled, onAnswerChange, onRemoveAnswer }) => {
  const handleChange = (event) => {
    onAnswerChange(index, event.target.value)
  }

  const KEY_UP_ARROW   = 38
  const KEY_DOWN_ARROW = 40
  const KEY_BACKSPACE  = 8
  const KEY_DELETE     = 46
  const handleKeyPress = (event) => {
    event = event || window.event;
    const key = event.keyCode || event.charCode

    switch(key) {
      case KEY_UP_ARROW:
        // TODO : Focus on previous answer
        break
      case KEY_DOWN_ARROW:
        // TODO : Focus on next answer
        break
      case KEY_BACKSPACE:
      case KEY_DELETE:
        if (compose(equals(0), length)(text)) {
          event.preventDefault()
          onRemoveAnswer(index)
          // TODO : Focus on previous answer
        }
        break
    }
  }

  return (
    <div className={'input input-answer'  + (disabled ? ' input-disabled' : '')}>
      <label
        className='input-label input-label-answer'
        htmlFor={'answer-'+index}>
          {index+1}
      </label>
      <input
        className='input-field input-field-answer'
        type='text'
        id={'answer-'+index}
        name={'answer-'+index}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        disabled={disabled} />
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
