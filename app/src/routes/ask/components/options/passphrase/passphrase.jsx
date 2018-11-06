import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updatePoll } from 'store/poll/actions'
import './passphrase.scss'

export class Passphrase extends PureComponent {
  handlePassphraseChange = (event) =>
    this.props.updateOptions({
      identifier : '',
      passphrase : event.target.value
    })

  render () {
    const { poll } = this.props

    return (
      <div className='input-option input-option-passphrase'>
        <label
          className='input-label input-label-passphrase'
          htmlFor='passphrase'>
          Set a passphrase (optional)
        </label>
        <input
          className='input-field input-field-passphrase'
          type='text'
          id='passphrase'
          name='passphrase'
          value={poll.passphrase}
          onChange={this.handlePassphraseChange} />
      </div>
    )
  }
}

Passphrase.propTypes = {
  poll          : PropTypes.object.isRequired,
  updateOptions : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  updateOptions: (value) => dispatch(updatePoll(value))
})

export default connect(null, mapDispatchToProps)(Passphrase)
