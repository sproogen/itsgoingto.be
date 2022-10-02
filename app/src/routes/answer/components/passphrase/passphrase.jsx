import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { APIError } from 'services/api'
import EventBus from 'services/event-bus'
import Button from 'components/button'
import './passphrase.scss'

const KEY_ENTER = 13

const Passphrase = ({
  identifier, setPassphrase, fetchPoll, setRequiresPassphrase,
}) => {
  const [error, setError] = useState(false)
  const [value, setValue] = useState('')
  const eventBus = EventBus.getEventBus()

  const submit = () => new Promise((resolve) => {
    setPassphrase(identifier, value)
    fetchPoll(identifier)
      .then((response) => {
        if (!(response instanceof APIError)) {
          setRequiresPassphrase(false)
        } else {
          setError(true)
        }
        resolve()
      })
  })

  const handleChange = (e) => setValue(e.target.value)

  const handleKeyPress = (event) => {
    const key = event.keyCode || event.charCode

    if (key === KEY_ENTER) {
      eventBus.emit('passphrase-submit')
    }
  }

  return (
    <div className="passphrase-container">
      <div className={`input-passphrase${error ? ' input-error' : ''}`}>
        <label
          className="input-label input-label-passphrase"
          htmlFor="passphrase"
        >
          Passphrase
          <input
            className="input-field input-field-passphrase"
            type="text"
            id="passphrase"
            name="passphrase"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />
        </label>
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
  setRequiresPassphrase: PropTypes.func.isRequired,
}

export default Passphrase
