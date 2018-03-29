import React from 'react'
import PropTypes from 'prop-types'
import './Modal.scss'

class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: true,
      willHidden: false
    }
  }

  whichAnimationEvent = () => {
    const element = document.createElement('fakeelement')
    const transitions = {
      'transition':'animationend',
      'OTransition':'oAnimationEnd',
      'MozTransition':'animationend',
      'WebkitTransition':'webkitAnimationEnd'
    }
    let transition

    for (transition in transitions) {
      if (element.style[transition] !== undefined) {
        return transitions[transition]
      }
    }
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

      animationEvent && node.addEventListener(animationEvent, endListener)
    }
  }

  show = () => {
    this.setState({
      hidden: false
    })
  }

  hide = function () {
    this.addAnimationListener(this.refs._backdrop, this.hidden)
    this.setState({
      willHidden: true
    })
  }.bind(this)

  hidden = function () {
    this.setState({
      hidden: true,
      willHidden: false
    })
  }.bind(this)

  render () {
    let modal

    if (!this.state.hidden) {
      const { willHidden } = this.state
      const { children } = this.props

      modal = <span className={willHidden ? 'willHidden' : ''}>
        <div ref='_backdrop' className='backdrop' onClick={this.hide} />
        <div ref='_modal' className='modal'>
          <div className='modal-container'>
            { children }
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
