import React from 'react'
import PropTypes from 'prop-types'
import PopperComponent, { popperPlacementPositions } from './PopperComponent'
import classnames from 'classnames'
import onClickOutside from 'react-onclickoutside'
import Time from './Time'

const outsideClickIgnoreClass = 'react-timepicker-ignore-onclickoutside'
const WrappedTime = onClickOutside(Time)

class TimePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
  }

  setOpen = (open) => {
    console.log('open', open)
    this.setState({
      open: open
    })
  }

  handleChange = (event) => {
  }

  handleFocus = (event) => {
    if (!this.state.preventFocus) {
      this.setOpen(true)
    }
  }

  onInputClick = () => {
    if (!this.props.disabled) {
      this.setOpen(true)
    }
  }

  handleClickOutside = (event) => {
    this.setOpen(false)
  }

  renderTime = () => {
    if (!this.state.open || this.props.disabled) {
      return null
    }
    return <WrappedTime
        ref={(elem) => { this._time = elem }}
        onClickOutside={this.handleClickOutside}
        outsideClickIgnoreClass={outsideClickIgnoreClass} />
  }

  renderInput = () => {
    var className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: this.state.open
    })

    const customInput = this.props.customInput || <input type="text" />
    const inputValue = this.props.value

    return React.cloneElement(customInput, {
      ref: 'input',
      value: inputValue,
      onChange: this.handleChange,
      onClick: this.onInputClick,
      onFocus: this.handleFocus,
      id: this.props.id,
      name: this.props.name,
      placeholder: this.props.placeholderText,
      disabled: this.props.disabled,
      className: className,
      readOnly: this.props.readOnly
    })
  }

  render () {
    const time = this.renderTime()

    return (
      <PopperComponent
        hidePopper={(!this.state.open || this.props.disabled)}
        targetComponent={
          <div className="react-timepicker__input-container">
            {this.renderInput()}
          </div>
        }
        popperComponent={time}/>
    )
  }
}

TimePicker.propTypes = {
  disabled: PropTypes.bool
}

TimePicker.defaultProps = {
  disabled: false
}

export default TimePicker
