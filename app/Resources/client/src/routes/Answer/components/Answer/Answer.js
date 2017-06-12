import React from 'react'
import PropTypes from 'prop-types'
import './Answer.scss'

export const Answer = ({ index, text }) => {
  return (
    <span className='input input-options'>
      <span className='result-wrapper'>
        <span className='result' name='answer-435' />
      </span>
      <input
        id={'answer-' + index}
        name='answer'
        className='input-radio input-radio-options'
        type='radio'
        value={index} />
      <label htmlFor={'answer-' + index} className='input-label input-label-options'>{ text }</label>
      <span htmlFor={'answer-' + index} className='input-label-votes'>0 votes</span>
    </span>
  )
}

Answer.propTypes = {
  index : PropTypes.number.isRequired,
  text  : PropTypes.string.isRequired
}

export default Answer
