import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import EventBus from 'services/event-bus'
import Spinner from 'components/spinner'
import './button.scss'

const Button = ({
  submitEvent, className, disabled, text, callback
}) => {
  const [loading, setLoading] = useState(false)
  const [eventListener, setEventListener] = useState(null)

  const isDisabled = () => disabled || loading

  const handlePress = (event) => {
    if (event) {
      event.preventDefault()
    }
    if (!isDisabled() && callback) {
      setLoading(true)
      callback().then((reset) => {
        if (reset !== false && this._mounted) { // eslint-disable-line
          setLoading(false)
        }
      })
    }
  }

  useEffect(() => {
    this._mounted = true // eslint-disable-line
    if (submitEvent) {
      setEventListener(EventBus.getEventBus().addListener(
        submitEvent,
        () => handlePress
      ))
    }
    return () => {
      this._mounted = false // eslint-disable-line
      if (eventListener) {
        eventListener.remove()
      }
    }
  }, [])

  return (
    <button
      type="button"
      className={`btn ${className}${isDisabled() ? ' disabled' : ''}`}
      disabled={disabled}
      onClick={handlePress}
    >
      {loading && <Spinner />}
      {!loading && <span>{text}</span>}
    </button>
  )
}

Button.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  callback: PropTypes.func,
  submitEvent: PropTypes.string
}

Button.defaultProps = {
  text: '',
  className: '',
  disabled: false,
  callback: null,
  submitEvent: null,
}

export default Button
