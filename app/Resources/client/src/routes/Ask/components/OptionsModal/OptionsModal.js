import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import Slider from 'react-rangeslider'
import DatePicker from 'react-datepicker'
import DatePickerInput from './DatePickerInput'
import { TimePicker } from 'antd';
import Modal from 'components/Modal'
import { pollSelector, updatePoll } from 'store/poll'
import 'react-rangeslider/lib/index.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'antd/lib/time-picker/style/index.css'
import './OptionsModal.scss'

class OptionsModal extends React.Component {
  show = () => {
    this._modal.show()
  }

  hide = () => {
    this._modal.hide()
  }

  handleMultipleChoiceChange = event =>
    this.props.updateOptions({
      identifier     : '',
      multipleChoice : event.target.checked
    })

  handlePassphraseChange = event =>
    this.props.updateOptions({
      identifier : '',
      passphrase : event.target.value
    })

  handleEndTypeChange = event =>
    this.props.updateOptions({
      identifier : '',
      endType    : event.target.value
    })

  handleEndInChange = value =>
    this.props.updateOptions({
      identifier : '',
      endIn      : value
    })

  handleEndAtChange = value => {
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

  timePickerDisabledMinutes = hour => {
    const { poll } = this.props

    if (poll.endAt.isSame(moment().add(1, 'hour'), 'hour')) {
      return [...Array(moment().minute()).keys()]
    }

    return []
  }

  componentWillReceiveProps = nextProps => {
    const { poll } = nextProps
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

  render () {
    const { poll } = this.props

    const formatEndin = value => value + ' hour' + (value > 1 ? 's' : '')

    return (
      <Modal ref={component => { this._modal = component }}>
        <h2 className='modal-title'>Poll Options</h2>
        <div className='modal-options'>
          <div className='input-option'>
            <input
              id='multiple-choice'
              className='input-checkbox input-checkbox-multipleChoice'
              name='multiple'
              type='checkbox'
              checked={poll.multipleChoice}
              onChange={this.handleMultipleChoiceChange} />
            <label
              htmlFor='multiple-choice'
              className='input-label input-label-options input-label-multipleChoice'>
                Multiple choice answers
            </label>
          </div>
          <hr />
          <div className='input-option'>
            <label className='input-label input-label-passphrase' htmlFor='passphrase'>Passphrase</label>
            <input
              className='input-field input-field-passphrase'
              type='text'
              id='passphrase'
              name='passphrase'
              ref='passphrase'
              value={poll.passphrase}
              onChange={this.handlePassphraseChange} />
          </div>
          <hr />
          <div className='input-option'>
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
                  Don't End Poll
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
            { poll.endType === 'endAt' &&
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
            { poll.endType === 'endIn' &&
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
        </div>
        <button className='btn modal-btn' onClick={this.hide}>Close</button>
      </Modal>
    )
  }
}

OptionsModal.propTypes = {
  poll          : PropTypes.object.isRequired,
  updateOptions : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  updateOptions : (value) => dispatch(updatePoll(value))
})

export default connect(null, mapDispatchToProps, null, { withRef: true })(OptionsModal)
