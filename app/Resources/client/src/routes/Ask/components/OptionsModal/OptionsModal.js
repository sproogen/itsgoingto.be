import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'components/Modal/Modal'
import { pollSelector, updatePoll } from 'store/poll'

class OptionsModal extends React.Component {
  show = () => {
    this._modal.show()
  }
  hide = function () {
    this._modal.hide()
  }.bind(this)

  handleChange = (event) =>
    this.props.updateOptions({
      identifier : '',
      multipleChoice : event.target.checked
    })

  render = () => (
    <Modal ref={component => { this._modal = component }}>
      <h2 className='modal-title'>Poll Options</h2>
      <div className='modal-options'>
        <input
          id='multiple-choice'
          className='input-checkbox input-checkbox-advanced'
          name='multiple'
          type='checkbox'
          onChange={this.handleChange}
          checked={this.props.poll.multipleChoice} />
        <label
          htmlFor='multiple-choice'
          className='input-label input-label-options input-label-advanced'>
            Multiple choice answers
          </label>
      </div>
      <button className='btn modal-btn' onClick={this.hide}>Close</button>
    </Modal>
  )
}

OptionsModal.propTypes = {
  poll          : PropTypes.object.isRequired,
  updateOptions : PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  poll : pollSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  updateOptions : (value) => dispatch(updatePoll(value))
})

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(OptionsModal)
