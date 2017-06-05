import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateAnswer } from '../../store/answers'

export const Answer = ({ index, text, disabled, onAnswerChange }) => {
  const handleChange = (event) => {
    onAnswerChange(index, event.target.value)
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
  }
})

export default connect(null, mapDispatchToProps)(Answer)
