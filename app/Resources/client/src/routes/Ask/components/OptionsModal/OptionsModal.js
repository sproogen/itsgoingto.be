import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'components/Modal'
import { updatePoll } from 'store/poll'
import './OptionsModal.scss'

class OptionsModal extends React.Component {
  show = () => {
    this._modal.show()
  }

  hide = function () {
    this._modal.hide()
  }.bind(this)

  handleMultipleChoiceChange = (event) =>
    this.props.updateOptions({
      identifier : '',
      multipleChoice : event.target.checked
    })

  handlePassphraseChange = (event) =>
    this.props.updateOptions({
      identifier : '',
      passphrase : event.target.value
    })

  render () {
    const { poll } = this.props

    return (
      <Modal ref={component => { this._modal = component }}>
        <h2 className='modal-title'>Poll Options</h2>
        <div className='modal-options'>
          <div className='input-option'>
            <input
              id='multiple-choice'
              className='input-checkbox input-checkbox-advanced'
              name='multiple'
              type='checkbox'
              checked={poll.multipleChoice}
              onChange={this.handleMultipleChoiceChange} />
            <label
              htmlFor='multiple-choice'
              className='input-label input-label-options input-label-advanced'>
                Multiple choice answers
            </label>
          </div>
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
