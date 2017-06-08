import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

class Button extends React.Component {
  constructor (props) {
    super(props)
    this.state = { disabled: false }
  }

  isDisabled = () => this.props.disabled || this.state.disabled

  handlePress = (event) => {
    event.preventDefault()
    if (!this.isDisabled()) {
      this.setState({ disabled: true})
      this.props.callback().then(() => {
        this.setState({ disabled: false})
      })
    }
  }

  render = () => (
    <button
      className={'btn ' + this.props.className + (this.isDisabled() ? ' disabled' : '')}
      disabled={this.props.disabled}
      onClick={this.handlePress}>
      {this.props.text}
    </button>
  )
}

Button.propTypes = {
  text      : PropTypes.string.isRequired,
  className : PropTypes.string,
  disabled  : PropTypes.bool,
  callback  : PropTypes.func.isRequired,
}

Button.defaultProps = {
  disabled : false,
};

export default Button
