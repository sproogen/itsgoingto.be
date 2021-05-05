import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Slider from 'react-rangeslider'
import DatePicker from 'react-datepicker'
import TimePicker from 'antd/lib/time-picker'

import DatePickerInput from './date-picker-input'

import 'react-rangeslider/lib/index.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'antd/lib/time-picker/style/index.css'
import './end-poll.scss'

const formatEndin = (value) => `${value} hour${(value > 1 ? 's' : '')}`

const EndPoll = ({ poll, updateOptions }) => {
  useEffect(() => {
    if (typeof poll.endIn === 'undefined') {
      updateOptions({
        identifier: '',
        endIn: 1
      })
    }
    if (typeof poll.endAt === 'undefined') {
      updateOptions({
        identifier: '',
        endAt: (
          moment()
            .add(1, 'days')
            .seconds(0)
            .milliseconds(0)
        )
      })
    }
  }, [poll])

  const handleEndTypeChange = (event) => updateOptions({
    identifier: '',
    endType: event.target.value
  })

  const handleEndInChange = (value) => updateOptions({
    identifier: '',
    endIn: value
  })

  const handleEndAtChange = (value) => {
    const minDate = moment().add(1, 'hour').seconds(0).milliseconds(0)

    if (value.isBefore(minDate)) {
      updateOptions({
        identifier: '',
        endAt: minDate
      })
    } else {
      updateOptions({
        identifier: '',
        endAt: value
      })
    }
  }

  const timePickerDisabledHours = () => {
    if (poll.endAt.isSame(moment(), 'day')) {
      return [...Array(moment().hour() + 1).keys()]
    }

    return []
  }

  const timePickerDisabledMinutes = () => {
    if (poll.endAt.isSame(moment().add(1, 'hour'), 'hour')) {
      return [...Array(moment().minute()).keys()]
    }

    return []
  }

  return (
    <div className="input-option input-option-endPoll">
      <div className="input-option-radios">
        <input
          id="end-never"
          className="input-radio input-checkbox-endType"
          name="endType"
          type="checkbox"
          checked={poll.endType !== 'endAt' && poll.endType !== 'endIn'}
          value="endNever"
          onChange={handleEndTypeChange}
        />
        <label // eslint-disable-line
          htmlFor="end-never"
          className="input-label input-label-options input-label-endType"
        >
          {'Don\'t End Poll'}
        </label>
        <input
          id="end-at"
          className="input-radio input-checkbox-endType"
          name="endType"
          type="checkbox"
          checked={poll.endType === 'endAt'}
          value="endAt"
          onChange={handleEndTypeChange}
        />
        <label // eslint-disable-line
          htmlFor="end-at"
          className="input-label input-label-options input-label-endType"
        >
          End Poll At
        </label>
        <input
          id="end-in"
          className="input-radio input-checkbox-endType"
          name="endType"
          type="radio"
          value="endIn"
          checked={poll.endType === 'endIn'}
          onChange={handleEndTypeChange}
        />
        <label // eslint-disable-line
          htmlFor="end-in"
          className="input-label input-label-options input-label-endType"
        >
          End Poll In
        </label>
      </div>
      {poll.endType === 'endAt'
        && (
        <div className="input-option-datepicker">
          <DatePicker
            customInput={<DatePickerInput />}
            dateFormat="DD/MM/YYYY"
            minDate={moment()}
            selected={poll.endAt}
            onChange={handleEndAtChange}
          />
          <TimePicker
            format="HH:mm"
            disabledHours={timePickerDisabledHours}
            disabledMinutes={timePickerDisabledMinutes}
            hideDisabledOptions
            value={poll.endAt}
            onChange={handleEndAtChange}
          />
        </div>
        )}
      {poll.endType === 'endIn'
        && (
        <div className="input-option-slider">
          <div className="input-option-slider-label">{formatEndin(poll.endIn)}</div>
          <Slider
            min={1}
            max={24}
            value={poll.endIn}
            tooltip={false}
            onChange={handleEndInChange}
          />
        </div>
        )}
    </div>
  )
}

EndPoll.propTypes = {
  poll: PropTypes.shape({
    endType: PropTypes.string,
    endIn: PropTypes.number,
    endAt: PropTypes.object
  }).isRequired,
  updateOptions: PropTypes.func.isRequired
}

export default EndPoll
