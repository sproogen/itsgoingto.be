import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { hasQuestionSelector } from 'store/poll'
import { canSubmitPollSelector } from 'store/answers'
import { postPoll } from 'store/api'
import { browserHistory } from 'react-router'
import Modal from 'boron/FadeModal'
import Button from 'components/Button/Button'
import './Actions.scss'

class Actions extends React.Component {
  submit = () => this.props.postPoll()
  .then((response) => {
    if (response !== false) {
      browserHistory.push('/' + response.identifier)
    }
  })

  options = () => {
    console.log('Show options')
    this.showModal()
    return Promise.resolve()
  }

  showModal = function(){
    this._modal.show()
  }
  hideModal = function(){
    this._modal.hide()
  }.bind(this)

  render = () => (
    <div>
    <div className={'actions hideable' + (this.props.hasQuestion ? '' : ' gone')}>
      <Button className='pull-left' text='Options' callback={this.options} />
      <Button className='pull-right' text='Create Poll' disabled={!this.props.canSubmitPoll} callback={this.submit} />
    </div>
      <Modal ref={component => this._modal = component}>
        <div className='modal-container'>
          <h2 className='modal-title'>I am a dialog</h2>
          <button className="modal-button" onClick={this.hideModal}>Close</button>
        </div>
      </Modal>
    </div>
  )
}

Actions.propTypes = {
  hasQuestion   : PropTypes.bool.isRequired,
  canSubmitPoll : PropTypes.bool.isRequired,
  postPoll      : PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  hasQuestion   : hasQuestionSelector(state),
  canSubmitPoll : canSubmitPollSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  postPoll : () => dispatch(postPoll())
})

export default connect(mapStateToProps, mapDispatchToProps)(Actions)
