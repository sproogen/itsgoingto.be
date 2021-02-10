import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import EventBus from 'services/event-bus'
import Spinner from 'components/spinner'
import './button.scss'

const Button = ({
  submitEvent, className, disabled, text, callback
}) => {
  const [loading, setLoading] = useState(false)

  const isDisabled = () => disabled || loading

  const handlePress = (event) => {
    if (event) {
      event.preventDefault()
    }
    if (!isDisabled() && callback) {
      setLoading(true)
      callback().then((reset) => {
        if (reset !== false) {
          setLoading(false)
        }
      })
    }
  }

  useEffect(() => {
    let subsctiption
    if (submitEvent) {
      subsctiption = EventBus.getEventBus().addListener(
        submitEvent,
        () => handlePress()
      )
    }
    return () => {
      if (subsctiption) {
        subsctiption.remove()
      }
    }
  }, [handlePress])

  return (
    <button
      data-testid={`button-${text.replace(/\W/g, '-')}`}
      type="button"
      className={classNames('btn', className, { disabled: isDisabled() })}
      disabled={isDisabled()}
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
