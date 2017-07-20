import React from 'react'
import PropTypes from 'prop-types'
import './Modal.scss'

class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hidden: true }
  }

  show = function () {
    this.setState({
      hidden: false
    })
  }
  hide = function () {
    this.setState({
      hidden: true
    })
  }.bind(this)

  render = () => {
    let modal
    if (!this.state.hidden) {
      modal = <span>
        <div ref='_backdrop' className='backdrop' onClick={this.hide} />
        <div ref='_modal' className='modal'>
          <div className='modal-container'>
            { this.props.children }
          </div>
        </div>
      </span>
    }
    return (
      <span>
        { modal }
      </span>
    )
  }
}

Modal.propTypes = {
  children : PropTypes.node.isRequired
}

export default Modal
