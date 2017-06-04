import React from 'react'
import PropTypes from 'prop-types'

export const Answer = ({ index, text, disabled }) => {
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

export default Answer
