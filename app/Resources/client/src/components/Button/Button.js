import React from 'react'
import PropTypes from 'prop-types'
import EventBus from 'components/EventBus'
import Spinner from 'components/Spinner/Spinner'
import './Button.scss'

class Button extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled : false,
      loading  : false
    }
  }

  componentDidMount = () => {
    this._mounted = true
    this.eventBus = EventBus.getEventBus()
    if (this.props.submitEvent) {
      this.eventListener = this.eventBus.addListener(this.props.submitEvent, () => {
        this.handlePress()
      })
    }
  }

  componentWillUnmount = () => {
    this._mounted = false
    if (this.eventListener) {
      this.eventListener.remove()
    }
  }

  isDisabled = () => this.props.disabled || this.state.disabled

  handlePress = (event) => {
    if (event) {
      event.preventDefault()
    }
    if (!this.isDisabled() && this.props.callback) {
      this.setState({
        disabled : true,
        loading  : true
      })
      this.props.callback().then((reset) => {
        if (reset !== false && this._mounted) {
          this.setState({
            disabled : false,
            loading  : false
          })
        }
      })
    }
  }

  render = () => (
    <button
      className={'btn ' + this.props.className + (this.isDisabled() ? ' disabled' : '')}
      disabled={this.props.disabled}
      onClick={this.handlePress}>
      {this.state.loading && <Spinner />}
      {!this.state.loading && <span>{this.props.text}</span>}
    </button>
  )
}

Button.propTypes = {
  text        : PropTypes.string,
  className   : PropTypes.string,
  disabled    : PropTypes.bool,
  callback    : PropTypes.func,
  submitEvent : PropTypes.string
}

Button.defaultProps = {
  text      : '',
  className : '',
  disabled  : false,
}

export default Button
