import React from 'react'
import PropTypes from 'prop-types'

const DatePickerInput = ({ value, onClick }) => (
  <span // eslint-disable-line
    className="input-option-datepicker-label"
    onClick={onClick}
  >
    {value}
  </span>
)

DatePickerInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string
}

DatePickerInput.defaultProps = {
  onClick: () => { /* Do nothing */ },
  value: ''
}

export default DatePickerInput
