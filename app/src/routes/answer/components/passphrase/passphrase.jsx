import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { mergeAll } from 'ramda'
import { fetchPoll, APIError } from 'services/api'
import { updatePoll } from 'store/poll/actions'
import { setRequiresPassphrase } from 'store/loader/actions'
import EventBus from 'components/event-bus'
import Button from 'components/button'
import './passphrase.scss'

const KEY_ENTER = 13

const Passphrase = ({
  identifier, setPassphrase, fetchPoll, setRequiresPassphrase
}) => {
  const [error, setError] = useState(false)
  const [value, setValue] = useState('')
  const [eventBus, setEventBus] = useState()

  useEffect(() => {
    setEventBus(EventBus.getEventBus())
  }, [])

  const submit = () => setPassphrase(value)
    .then(() => fetchPoll(identifier)
      .then((response) => {
        if (!(response instanceof APIError)) {
          setRequiresPassphrase(false)
        } else {
          setError(true)
        }
      }))

  const handleChange = (e) => setValue(e.target.value)

  const handleKeyPress = (event = window.event) => {
    const key = event.keyCode || event.charCode

    if (key === KEY_ENTER) {
      eventBus.emit('passphrase-submit')
    }
  }

  return (
    <div className="passphrase-container">
      <div className={`input-passphrase${error ? ' input-error' : ''}`}>
        <label className="input-label input-label-passphrase" htmlFor="passphrase">Passphrase</label>
        <input
          className="input-field input-field-passphrase"
          type="text"
          id="passphrase"
          name="passphrase"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
        {error && (
          <span className="input-error-label">
            Passphrase incorrect
          </span>
        )}
      </div>
      <Button className="btn pull-right" text="Enter" callback={submit} submitEvent="passphrase-submit" />
    </div>
  )
}

Passphrase.propTypes = {
  identifier: PropTypes.string.isRequired,
  setPassphrase: PropTypes.func.isRequired,
  fetchPoll: PropTypes.func.isRequired,
  setRequiresPassphrase: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  setPassphrase: (value, identifier) => dispatch(updatePoll({ passphrase : value, identifier })),
  fetchPoll: (identifier) => dispatch(fetchPoll(identifier)),
  setRequiresPassphrase: (value) => dispatch(setRequiresPassphrase(value))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => mergeAll([stateProps, dispatchProps, ownProps.params])

export default connect(null, mapDispatchToProps, mergeProps)(Passphrase)
