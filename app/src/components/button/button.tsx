import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { EventSubscription } from 'fbemitter'
import EventBus from '@/services/event-bus'
import Spinner from '@/components/spinner'
import './button.scss'

type Props = {
  text?: string
  className?: string
  disabled?: boolean
  callback?: () => Promise<boolean | void>
  submitEvent?: string
}

const Button = ({
  text = '',
  className = '',
  disabled = false,
  callback,
  submitEvent,
}: Props): React.ReactElement => {
  const [loading, setLoading] = useState(false)

  const isDisabled = () => disabled || loading

  const handlePress = (event?: React.MouseEvent) => {
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
    let subscription: EventSubscription | null
    if (submitEvent) {
      subscription = EventBus.getEventBus().addListener(
        submitEvent,
        () => handlePress(),
      )
    }
    return () => {
      if (subscription) {
        subscription.remove()
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

export default Button
