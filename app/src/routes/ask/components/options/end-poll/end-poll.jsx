import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import Slider from 'react-rangeslider'
import DatePicker from 'react-datepicker'
import TimePicker from 'antd/lib/time-picker'

import { updatePoll } from 'store/poll'
import DatePickerInput from './date-picker-input'

import 'react-rangeslider/lib/index.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'antd/lib/time-picker/style/index.css'
import './end-poll.scss'

const formatEndin = (value) => value + ' hour' + (value > 1 ? 's' : '')

class EndPoll extends React.Component {
  componentDidUpdate = () => {
    const { poll } = this.props

    if (typeof poll.endIn === 'undefined') {
      this.props.updateOptions({
        identifier : '',
        endIn      : 1
      })
    }
    if (typeof poll.endAt === 'undefined') {
      this.props.updateOptions({
        identifier : '',
        endAt      : moment().add(1, 'days').seconds(0).milliseconds(0)
      })
    }
  }

  handleEndTypeChange = (event) =>
    this.props.updateOptions({
      identifier : '',
      endType    : event.target.value
    })

  handleEndInChange = (value) =>
    this.props.updateOptions({
      identifier : '',
      endIn      : value
    })

  handleEndAtChange = (value) => {
    const minDate = moment().add(1, 'hour').seconds(0).milliseconds(0)

    if (value.isBefore(minDate)) {
      this.props.updateOptions({
        identifier : '',
        endAt      : minDate
      })
    } else {
      this.props.updateOptions({
        identifier : '',
        endAt      : value
      })
    }
  }

  timePickerDisabledHours = () => {
    const { poll } = this.props

    if (poll.endAt.isSame(moment(), 'day')) {
      return [...Array(moment().hour() + 1).keys()]
    }

    return []
  }

  timePickerDisabledMinutes = () => {
    const { poll } = this.props

    if (poll.endAt.isSame(moment().add(1, 'hour'), 'hour')) {
      return [...Array(moment().minute()).keys()]
    }

    return []
  }

  render () {
    const { poll } = this.props

    return (
      <div className='input-option input-option-endPoll'>
        <div className='input-option-radios'>
          <input
            id='end-never'
            className='input-radio input-checkbox-endType'
            name='endType'
            type='checkbox'
            checked={poll.endType !== 'endAt' && poll.endType !== 'endIn'}
            value='endNever'
            onChange={this.handleEndTypeChange} />
          <label
            htmlFor='end-never'
            className='input-label input-label-options input-label-endType'>
            {'Don\'t End Poll'}
          </label>
          <input
            id='end-at'
            className='input-radio input-checkbox-endType'
            name='endType'
            type='checkbox'
            checked={poll.endType === 'endAt'}
            value='endAt'
            onChange={this.handleEndTypeChange} />
          <label
            htmlFor='end-at'
            className='input-label input-label-options input-label-endType'>
            End Poll At
          </label>
          <input
            id='end-in'
            className='input-radio input-checkbox-endType'
            name='endType'
            type='radio'
            value='endIn'
            checked={poll.endType === 'endIn'}
            onChange={this.handleEndTypeChange} />
          <label
            htmlFor='end-in'
            className='input-label input-label-options input-label-endType'>
            End Poll In
          </label>
        </div>
        {poll.endType === 'endAt' &&
          <div className='input-option-datepicker'>
            <DatePicker
              customInput={<DatePickerInput />}
              dateFormat='DD/MM/YYYY'
              minDate={moment()}
              selected={poll.endAt}
              onChange={this.handleEndAtChange} />
            <TimePicker
              format='HH:mm'
              disabledHours={this.timePickerDisabledHours}
              disabledMinutes={this.timePickerDisabledMinutes}
              hideDisabledOptions
              value={poll.endAt}
              onChange={this.handleEndAtChange} />
          </div>
        }
        {poll.endType === 'endIn' &&
          <div className='input-option-slider'>
            <div className='input-option-slider-label'>{formatEndin(poll.endIn)}</div>
            <Slider
              min={1}
              max={24}
              value={poll.endIn}
              tooltip={false}
              onChange={this.handleEndInChange}
            />
          </div>
        }
      </div>
    )
  }
}

EndPoll.propTypes = {
  poll          : PropTypes.object.isRequired,
  updateOptions : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  updateOptions: (value) => dispatch(updatePoll(value))
})

export default connect(null, mapDispatchToProps)(EndPoll)
