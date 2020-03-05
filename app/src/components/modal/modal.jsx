import React from 'react'
import PropTypes from 'prop-types'
import './modal.scss'

// TODO : Improve this

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hidden: true,
      willHidden: false
    }
  }

  whichAnimationEvent = () => {
    const element = document.createElement('fakeelement')
    const transitions = {
      transition: 'animationend',
      OTransition: 'oAnimationEnd',
      MozTransition: 'animationend',
      WebkitTransition: 'webkitAnimationEnd'
    }
    let transition

    for (transition in transitions) { // eslint-disable-line
      if (element.style[transition] !== undefined) {
        return transitions[transition]
      }
    }
    return null
  }

  addAnimationListener = (node, handle) => {
    if (node) {
      const animationEvent = this.whichAnimationEvent()
      const endListener = (event) => {
        if (event && event.target !== node) {
          return
        }
        node.removeEventListener(animationEvent, endListener)
        handle()
      }

      if (animationEvent) {
        node.addEventListener(animationEvent, endListener)
      }
    }
  }

  show = () => {
    this.setState({
      hidden: false
    })
  }

  hide = function () { // eslint-disable-line
    this.addAnimationListener(this._backdrop, this.hidden) // eslint-disable-line
    this.setState({
      willHidden: true
    })
  }.bind(this)

  hidden = function () { // eslint-disable-line
    this.setState({
      hidden: true,
      willHidden: false
    })
  }.bind(this)

  render() {
    const { hidden } = this.state

    if (hidden) {
      return null
    }

    const { willHidden } = this.state
    const { children } = this.props

    return (
      <span>
        <span className={willHidden ? 'willHidden' : ''}>
          <div // eslint-disable-line
            ref={(c) => { this._backdrop = c }} // eslint-disable-line
            className="backdrop"
            onClick={this.hide}
          />
          <div
            ref={(c) => { this._modal = c }} // eslint-disable-line
            className="modal"
          >
            <div className="modal-container">
              { children }
            </div>
          </div>
        </span>
      </span>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired
}

export default Modal
