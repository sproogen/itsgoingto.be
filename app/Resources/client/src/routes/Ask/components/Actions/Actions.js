import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { postPoll } from 'store/api'
import { browserHistory } from 'react-router'
import Button from 'components/Button'
import OptionsModal from '../OptionsModal'

class Actions extends React.Component {
  submit = () => this.props.postPoll()
  .then((response) => {
    if (response !== false) {
      browserHistory.push('/' + response.identifier)
      return false
    }
    return true
  })

  options = () => {
    this._modal.getWrappedInstance().show()
    return Promise.resolve()
  }

  render () {
    const { hasQuestion, canSubmitPoll, poll } = this.props

    return (
      <div>
        <div className={'actions hideable' + (hasQuestion ? '' : ' gone')}>
          <Button className='pull-left' text='Options' callback={this.options} />
          <Button className='pull-right' text='Create Poll' disabled={!canSubmitPoll} callback={this.submit} />
        </div>
        <OptionsModal ref={(component) => { this._modal = component }} poll={poll} />
      </div>
    )
  }
}

Actions.propTypes = {
  hasQuestion   : PropTypes.bool.isRequired,
  canSubmitPoll : PropTypes.bool.isRequired,
  postPoll      : PropTypes.func.isRequired,
  poll          : PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  postPoll : () => dispatch(postPoll())
})

export default connect(null, mapDispatchToProps)(Actions)
