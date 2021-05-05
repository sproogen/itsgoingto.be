import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

const DatePickerInput = forwardRef(
  ({ value, onClick }, ref) => (
    <span // eslint-disable-line
      className="input-option-datepicker-label"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </span>
  )
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
