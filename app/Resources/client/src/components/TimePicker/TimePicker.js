import React from 'react'
import PopperComponent, { popperPlacementPositions } from './PopperComponent'
import classnames from 'classnames'

const outsideClickIgnoreClass = 'react-timepicker-ignore-onclickoutside'

class TimePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
  }

  setOpen = (open) => {
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
    return (
      <PopperComponent
        hidePopper={(!this.state.open || this.props.disabled)}
        targetComponent={
          <div className="react-timepicker__input-container">
            {this.renderInput()}
          </div>
        }
        popperComponent={<div><h1>Hii</h1></div>}/>
    )
  }
}

TimePicker.propTypes = {

}

export default TimePicker
