import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Slider from 'react-rangeslider'
import Modal from 'components/Modal'
import { pollSelector, updatePoll } from 'store/poll'
import 'react-rangeslider/lib/index.css'
import './OptionsModal.scss'

class OptionsModal extends React.Component {
  show = () => {
    this._modal.show()
  }

  hide = function () {
    this._modal.hide()
  }.bind(this)

  handleMultipleChoiceChange = event =>
    this.props.updateOptions({
      identifier : '',
      multipleChoice : event.target.checked
    })

  handlePassphraseChange = event =>
    this.props.updateOptions({
      identifier : '',
      passphrase : event.target.value
    })

  handleEndTypeChange = event => {
    this.props.updateOptions({
      identifier : '',
      endType : event.target.value
    })

  handleEndInChange = value =>
    this.props.updateOptions({
      identifier : '',
      endIn : value
    })

  render () {
    const { poll } = this.props
    let { endIn } = poll
    if (typeof endIn === 'undefined') {
      endIn = 1
    }

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
                datepicker
              </div>
            }
            { poll.endType === 'endIn' &&
              <div className='input-option-slider'>
                <div className='input-option-slider-label'>{formatEndin(endIn)}</div>
                <Slider
                  min={1}
                  max={24}
                  value={endIn}
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
