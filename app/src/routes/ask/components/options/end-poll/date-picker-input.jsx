import React from 'react'
import PropTypes from 'prop-types'

export class DatePickerInput extends React.Component {
  render = () => (
    <span
      className='input-option-datepicker-label'
      onClick={this.props.onClick}>
      {this.props.value}
    </span>
  )
}

DatePickerInput.propTypes = {
  onClick : PropTypes.func,
  value   : PropTypes.string
}

export default DatePickerInput
